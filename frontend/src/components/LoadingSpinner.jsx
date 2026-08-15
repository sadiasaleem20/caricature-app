export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-5xl animate-float">🖌️</div>
      <p className="text-lg font-semibold text-caric-willow">
        Drawing your caricature...
      </p>
    </div>
  );
}
