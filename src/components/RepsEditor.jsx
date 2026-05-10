export function RepsEditor({ value, onChange, type, target }) {
  const current = typeof value === "number" ? value : 0;
  const isDuration = type === "duration";
  const step = isDuration ? 5 : 1;

  const adjust = (delta) => onChange(Math.max(0, current + delta));

  return (
    <div className="editor">
      <span className="editor__label">
        {isDuration ? "Time" : "Reps"}
        <span className="editor__target"> · target {target}</span>
      </span>
      <div className="editor__controls editor__controls--three">
        <button
          type="button"
          className="editor__btn"
          onClick={() => adjust(-step)}
          aria-label={`Decrease by ${step}`}
        >
          −{step}
        </button>
        <span className="editor__value">
          {current}
          {isDuration && <span className="editor__unit">s</span>}
        </span>
        <button
          type="button"
          className="editor__btn"
          onClick={() => adjust(step)}
          aria-label={`Increase by ${step}`}
        >
          +{step}
        </button>
      </div>
    </div>
  );
}
