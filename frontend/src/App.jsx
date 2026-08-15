import { useState } from "react";
import UploadZone from "./components/UploadZone";
import StyleToggle from "./components/StyleToggle";
import LoadingSpinner from "./components/LoadingSpinner";
import ResultCard from "./components/ResultCard";
import { generateCaricature } from "./lib/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState("sketch");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { imageUrl } = await generateCaricature(file, style);
      setResultUrl(imageUrl);
    } catch (err) {
      setError("Oops, something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-16">
      {/* corner blobs */}
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-caric-mauve/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-caric-caramel/50 blur-3xl" />

      <div className="relative w-full max-w-lg text-center">
        <h1 className="font-script text-6xl md:text-7xl font-bold leading-none">
          <span className="text-caric-willow">Caricature</span>{" "}
          <span className="text-caric-mauve">Me!</span>{" "}
          <span className="text-caric-carnation">♡</span>
        </h1>
        <p className="mt-4 text-caric-wood/70 font-medium">
          Upload a photo, pick a style,
          <br />
          and get your very own AI-drawn caricature.
        </p>

        <div className="mt-10">
          {!resultUrl && !loading && (
            <>
              <UploadZone onFileSelect={handleFileSelect} preview={preview} />
              <div className="mt-6">
                <StyleToggle style={style} setStyle={setStyle} />
              </div>
              <button
                disabled={!file}
                onClick={handleGenerate}
                className="mt-6 w-full py-3 rounded-full font-semibold text-lg bg-caric-willow text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-caric-wood transition-colors shadow-sm"
              >
                ✦ Generate Caricature
              </button>
              {error && (
                <p className="mt-3 text-caric-carnation font-medium">{error}</p>
              )}
            </>
          )}

          {loading && (
            <div className="flex justify-center py-10">
              <LoadingSpinner />
            </div>
          )}

          {resultUrl && !loading && (
            <ResultCard imageUrl={resultUrl} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  );
}
