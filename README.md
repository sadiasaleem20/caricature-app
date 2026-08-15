# 🎨 Caricature Me!

Upload a photo, pick a style — pencil sketch or full color — and get your own AI-generated caricature in seconds. Built for the AWS Weekend Creative Challenge (August 2026).

**Live app:** _add your Amplify URL here_
**Demo:** _add a screenshot or short video link here_

## What it does

Caricature Me! takes a user's uploaded photo and generates a fun, exaggerated caricature-style portrait using Amazon Bedrock's Nova Canvas model. Users choose between:
- ✏️ **Sketch** — black-and-white pencil-style line art
- 🎨 **Colored** — vibrant, painted illustration style

The result is generated on the fly, stored in S3, and served back to the user via a signed URL.

## Architecture

React (Vite + Tailwind) — Amplify Hosting
│
▼
API Gateway (HTTP API)
│
▼
AWS Lambda (Node.js)
│
├──▶ Amazon Bedrock — Nova Canvas (image generation)
│
└──▶ Amazon S3 (stores result, returns signed URL)


**AWS services used:**
- **Amazon Bedrock (Nova Canvas)** — generates the caricature image from the uploaded photo and a style-specific prompt
- **AWS Lambda** — handles the request, calls Bedrock, stores the result
- **Amazon API Gateway** — public HTTP endpoint the frontend calls
- **Amazon S3** — stores generated images and serves them via signed URLs
- **AWS Amplify Hosting** — hosts and deploys the React frontend from this GitHub repo
- **IAM** — scoped role granting Lambda access to only Bedrock (Nova Canvas) and the results S3 bucket

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js 20 on AWS Lambda, AWS SDK v3
- **Infra:** Deployed via AWS CLI (Lambda, API Gateway, IAM) and Amplify CLI (hosting)

## Project structure

caricature-app/
├── frontend/ # React + Vite + Tailwind app
├── backend/ # Lambda function source (index.mjs)
└── infra/ # IAM trust policy for the Lambda role

## How it works

1. User drags/drops or selects a photo in the browser.
2. Frontend resizes the image client-side and sends it as base64 JSON to the API Gateway endpoint.
3. Lambda receives the request, builds a style-specific prompt (sketch vs. color), and calls Bedrock's `amazon.nova-canvas-v1:0` model using the `IMAGE_VARIATION` task type.
4. The generated image is uploaded to S3, and Lambda returns a signed URL.
5. Frontend displays the result with download and "try another" options.

## Notes

- Uploaded photos are processed transiently and not permanently retained beyond generation.
- This project uses Bedrock's image variation/style-transfer capability rather than true feature-exaggeration — results lean toward stylized portraits rather than hand-drawn caricature exaggeration.

## Built for

[AWS Weekend Creative Challenge](https://community.aws/content)

