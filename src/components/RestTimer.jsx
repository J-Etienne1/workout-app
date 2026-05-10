export function RestTimer({ secondsLeft, duration, onReset, onSkip }) {
  if (secondsLeft === null) return null;
  const pct = Math.max(0, Math.min(100, (secondsLeft / duration) * 100));

  return (
    <div className="rest-timer" role="timer" aria-live="polite">
      <div className="rest-timer__bar" style={{ width: `${pct}%` }} />
      <div className="rest-timer__row">
        <div className="rest-timer__label">
          <span className="rest-timer__name">Rest</span>
          <span className="rest-timer__time">{secondsLeft}s</span>
        </div>
        <div className="rest-timer__btns">
          <button
            type="button"
            className="rest-timer__btn"
            onClick={onReset}
            aria-label="Reset timer"
          >
            ↺
          </button>
          <button
            type="button"
            className="rest-timer__btn rest-timer__btn--skip"
            onClick={onSkip}
            aria-label="Skip rest"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
