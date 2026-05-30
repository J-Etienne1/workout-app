import { useEffect, useRef } from "react";
import { REST_PRESETS } from "../hooks/useRestTimer.js";

export function RestTimer({
  secondsLeft,
  duration,
  onReset,
  onSkip,
  onChoosePreset,
}) {
  const ref = useRef(null);
  const visible = secondsLeft !== null;

  // Keep the bar pinned to the bottom of the *visual* viewport. Mobile
  // browsers anchor `position: fixed` to the layout viewport, so when the
  // address bar slides in (often docked at the bottom on Android) it covers
  // a bottom-fixed element. Nudge the bar up by the toolbar's height instead.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!visible || !vv) return undefined;

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const offset = Math.max(
        0,
        document.documentElement.clientHeight - (vv.height + vv.offsetTop)
      );
      el.style.transform = `translateY(${-offset}px)`;
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [visible]);

  if (secondsLeft === null) return null;
  const pct = Math.max(0, Math.min(100, (secondsLeft / duration) * 100));

  return (
    <div className="rest-timer" ref={ref} role="timer" aria-live="polite">
      <div className="rest-timer__bar" style={{ width: `${pct}%` }} />
      <div className="rest-timer__row">
        <div className="rest-timer__label">
          <span className="rest-timer__name">Rest</span>
          <span className="rest-timer__time">{secondsLeft}s</span>
        </div>
        <div className="rest-timer__presets" role="group" aria-label="Rest length">
          {REST_PRESETS.map((secs) => (
            <button
              key={secs}
              type="button"
              className={`rest-timer__preset ${
                duration === secs ? "is-active" : ""
              }`}
              aria-pressed={duration === secs}
              onClick={() => onChoosePreset(secs)}
            >
              {secs}s
            </button>
          ))}
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
