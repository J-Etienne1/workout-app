import { useEffect, useRef, useState } from "react";
import { workouts } from "./data/workouts.js";
import { useWorkoutState } from "./hooks/useWorkoutState.js";
import { useRestTimer } from "./hooks/useRestTimer.js";
import { DayTabs } from "./components/DayTabs.jsx";
import { ExerciseCard } from "./components/ExerciseCard.jsx";
import { FinisherCard } from "./components/FinisherCard.jsx";
import { InfoPanel } from "./components/InfoPanel.jsx";
import { RestTimer } from "./components/RestTimer.jsx";

function todayDefaultDay() {
  const dow = new Date().getDay();
  if (dow === 3) return "wednesday";
  if (dow === 6) return "saturday";
  return "saturday";
}

export default function App() {
  const [activeDay, setActiveDay] = useState(todayDefaultDay);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(true);
  const [wakeLockError, setWakeLockError] = useState("");
  const wakeLockRef = useRef(null);
  const { state, updateExercise, resetExercise } = useWorkoutState();
  const restTimer = useRestTimer();
  const day = workouts[activeDay];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeDay]);

  useEffect(() => {
    const supportsWakeLock = "wakeLock" in navigator;
    setWakeLockSupported(supportsWakeLock);

    if (!supportsWakeLock) {
      return undefined;
    }

    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (!isMounted) return;

        wakeLockRef.current = lock;
        setWakeLockError("");

        lock.addEventListener("release", () => {
          setWakeLockError("");
          wakeLockRef.current = null;
        });
      } catch (error) {
        if (!isMounted) return;
        setWakeLockError(error?.message ?? "Failed to acquire wake lock");
        console.error("Wake lock error:", error);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        await requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__row">
          <h1 className="topbar__title">Workout</h1>
          <button
            type="button"
            className="topbar__info"
            onClick={() => setInfoOpen(true)}
            aria-label="Program info"
          >
            ⓘ
          </button>
        </div>
        <DayTabs activeDay={activeDay} onChange={setActiveDay} />
      </header>

      <main className="main">
        <button
          type="button"
          className="warmup"
          onClick={() => setWarmupOpen((v) => !v)}
          aria-expanded={warmupOpen}
        >
          <span className="warmup__label">Warmup</span>
          <span className="warmup__chev">{warmupOpen ? "▾" : "▸"}</span>
        </button>
        {(!wakeLockSupported || wakeLockError) && (
          <div className="wake-lock-notice" role="status" aria-live="polite">
            {!wakeLockSupported
              ? "Screen wake lock is not supported on this browser. The screen may dim or turn off automatically."
              : `Unable to keep the screen awake: ${wakeLockError}`}
          </div>
        )}
        {warmupOpen && <p className="warmup__body">{day.warmup}</p>}

        <ol className="cards">
          {day.exercises.map((ex, i) => (
            <li key={ex.id}>
              <ExerciseCard
                index={i + 1}
                exercise={ex}
                state={state[ex.id]}
                onUpdate={updateExercise}
                onReset={resetExercise}
                onSetCompleted={() => restTimer.start()}
              />
            </li>
          ))}
          {day.finisher && (
            <li>
              <FinisherCard finisher={day.finisher} />
            </li>
          )}
        </ol>

        <footer className="footer">
          <p>Personal use · data saved on this device only.</p>
        </footer>
      </main>

      {infoOpen && <InfoPanel onClose={() => setInfoOpen(false)} />}

      <RestTimer
        secondsLeft={restTimer.secondsLeft}
        duration={restTimer.duration}
        onReset={restTimer.reset}
        onSkip={restTimer.skip}
      />
    </div>
  );
}
