import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const REGION = "us-east-1";
const BUCKET = process.env.RESULTS_BUCKET;
const MAX_GENERATIONS = 10;
const COUNTER_KEY = "counter/generation-count.txt";

const bedrock = new BedrockRuntimeClient({ region: REGION, maxAttempts: 5 });
const s3 = new S3Client({ region: REGION });

const STYLE_PROMPTS = {
  sketch:
    "black and white pencil sketch caricature portrait, exaggerated facial features, hand-drawn line art, clean plain background",
  color:
    "colorful painted caricature portrait, exaggerated facial features, vibrant playful digital illustration, clean plain background",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

function respond(statusCode, bodyObj) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj),
  };
}

async function checkAndIncrementCounter() {
  let count = 0;
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: COUNTER_KEY }),
    );
    count = parseInt(await res.Body.transformToString(), 10) || 0;
  } catch {
    count = 0; // counter object doesn't exist yet — first run
  }

  if (count >= MAX_GENERATIONS) {
    throw new Error("LIMIT_REACHED");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: COUNTER_KEY,
      Body: String(count + 1),
      ContentType: "text/plain",
    }),
  );
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  try {
    const { imageBase64, style } = JSON.parse(event.body);
    if (!imageBase64 || !style) {
      return respond(400, { error: "Missing imageBase64 or style" });
    }

    await checkAndIncrementCounter();

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.sketch;

    const payload = {
      taskType: "IMAGE_VARIATION",
      imageVariationParams: {
        images: [cleanBase64],
        text: prompt,
        negativeText: "blurry, low quality, distorted, extra limbs, watermark",
        similarityStrength: 0.6,
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        quality: "standard",
        width: 1024,
        height: 1024,
        cfgScale: 8.0,
      },
    };

    const response = await bedrock.send(
      new InvokeModelCommand({
        modelId: "amazon.nova-canvas-v1:0",
        body: JSON.stringify(payload),
        contentType: "application/json",
        accept: "application/json",
      }),
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const imageBuffer = Buffer.from(responseBody.images[0], "base64");

    const key = `results/${randomUUID()}.png`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: imageBuffer,
        ContentType: "image/png",
      }),
    );

    const imageUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 3600 },
    );

    return respond(200, { imageUrl });
  } catch (err) {
    if (err.message === "LIMIT_REACHED") {
      return respond(429, {
        error: "Demo limit reached — please try again later.",
      });
    }
    console.error(err);
    return respond(500, { error: "Generation failed" });
  }
};
