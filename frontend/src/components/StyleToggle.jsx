export default function StyleToggle({ style, setStyle }) {
  const options = [
    { key: "sketch", label: "Sketch", icon: "✎" },
    { key: "color", label: "Colored", icon: "◍" },
  ];

  return (
    <div className="inline-flex bg-white rounded-full border border-caric-sango p-1 shadow-sm">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setStyle(opt.key)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all
            ${
              style === opt.key
                ? "bg-caric-carnation text-white shadow-sm"
                : "text-caric-willow hover:bg-caric-sango/20"
            }`}
        >
          <span>{opt.icon}</span> {opt.label}
        </button>
      ))}
    </div>
  );
}
