import { useEffect, useState } from "react";
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
  const { state, updateExercise, resetExercise } = useWorkoutState();
  const restTimer = useRestTimer();
  const day = workouts[activeDay];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeDay]);

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
