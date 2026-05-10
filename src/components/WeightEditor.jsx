function format(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export function WeightEditor({ value, onChange }) {
  const current = typeof value === "number" ? value : 0;
  const adjust = (delta) => {
    const next = Math.max(0, Math.round((current + delta) * 10) / 10);
    onChange(next);
  };

  return (
    <div className="editor">
      <span className="editor__label">Weight</span>
      <div className="editor__controls">
        <button
          type="button"
          className="editor__btn editor__btn--lg"
          onClick={() => adjust(-2.5)}
          aria-label="Decrease weight by 2.5 kg"
        >
          −2.5
        </button>
        <button
          type="button"
          className="editor__btn"
          onClick={() => adjust(-0.5)}
          aria-label="Decrease weight by 0.5 kg"
        >
          −0.5
        </button>
        <span className="editor__value">
          {format(current)}
          <span className="editor__unit">kg</span>
        </span>
        <button
          type="button"
          className="editor__btn"
          onClick={() => adjust(0.5)}
          aria-label="Increase weight by 0.5 kg"
        >
          +0.5
        </button>
        <button
          type="button"
          className="editor__btn editor__btn--lg"
          onClick={() => adjust(2.5)}
          aria-label="Increase weight by 2.5 kg"
        >
          +2.5
        </button>
      </div>
    </div>
  );
}
