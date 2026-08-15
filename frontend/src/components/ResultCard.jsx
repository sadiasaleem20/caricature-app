export default function ResultCard({ imageUrl, onReset }) {
  return (
    <div className="flex flex-col items-center gap-4 animate-pop">
      <img
        src={imageUrl}
        alt="Your caricature"
        className="rounded-3xl shadow-lg max-h-96 border-4 border-white"
      />
      <div className="flex gap-3">
        <a
          href={imageUrl}
          download="caricature.png"
          className="px-5 py-2 rounded-full bg-caric-willow text-white font-semibold hover:bg-caric-wood transition-colors"
        >
          ⬇ Download
        </a>
        <button
          onClick={onReset}
          className="px-5 py-2 rounded-full bg-caric-sango/40 text-caric-wood font-semibold hover:bg-caric-sango/60 transition-colors"
        >
          ↺ Try another
        </button>
      </div>
    </div>
  );
}
