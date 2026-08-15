import { useCallback, useState } from "react";

export default function UploadZone({ onFileSelect, preview }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed cursor-pointer transition-all
        ${
          dragging
            ? "border-caric-carnation bg-caric-sango/20 scale-105"
            : "border-caric-mauve/50 bg-caric-sango/10 hover:bg-caric-sango/20"
        }`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Your upload"
          className="h-full rounded-2xl object-contain animate-pop p-3"
        />
      ) : (
        <div className="text-center animate-float">
          <svg
            className="w-14 h-14 mx-auto mb-2 text-caric-mauve"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 18a4.5 4.5 0 0 1-1.5-8.7A5.5 5.5 0 0 1 16.3 7.2 4.5 4.5 0 0 1 17 18H7Z" />
            <path d="M12 11v7M9 14l3-3 3 3" />
          </svg>
          <p className="text-xl font-semibold text-caric-wood">
            Drop your photo here
          </p>
          <p className="text-sm text-caric-carnation font-medium mt-1">
            or click to browse
          </p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </label>
  );
}
