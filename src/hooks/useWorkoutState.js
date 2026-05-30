import { useCallback, useEffect, useRef, useState } from "react";
import { workouts } from "../data/workouts.js";

const STORAGE_KEY = "workout-app:state";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function buildInitialExercises() {
  const exercises = {};
  for (const day of Object.values(workouts)) {
    for (const ex of day.exercises) {
      exercises[ex.id] = {
        weight: ex.defaults.weight,
        currentReps: ex.defaults.currentReps,
        setsDone: 0,
      };
    }
  }
  return exercises;
}

function loadState() {
  const initial = buildInitialExercises();
  const today = todayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { exercises: initial, sessionDate: today };

    const saved = JSON.parse(raw);
    // Migrate the old flat format ({ [id]: { weight, currentReps } }) — the
    // whole object was the exercises map before sessionDate/setsDone existed.
    const savedExercises = saved.exercises ?? saved;
    const sameDay = saved.sessionDate === today;

    const exercises = {};
    for (const id of Object.keys(initial)) {
      const s = savedExercises[id] ?? {};
      exercises[id] = {
        weight: s.weight ?? initial[id].weight,
        currentReps: s.currentReps ?? initial[id].currentReps,
        // Set progress is a "today's workout" checklist — keep it across
        // reloads/tab switches within a day, but reset it on a new day.
        setsDone: sameDay ? s.setsDone ?? 0 : 0,
      };
    }
    return { exercises, sessionDate: today };
  } catch {
    return { exercises: initial, sessionDate: today };
  }
}

export function useWorkoutState() {
  const [state, setState] = useState(loadState);
  const writeTimer = useRef(null);

  useEffect(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // localStorage full or disabled — silently ignore for personal app
      }
    }, 200);
    return () => clearTimeout(writeTimer.current);
  }, [state]);

  const updateExercise = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [id]: { ...prev.exercises[id], ...patch },
      },
    }));
  }, []);

  const resetExercise = useCallback((id) => {
    setState((prev) => {
      const exercises = { ...prev.exercises };
      for (const day of Object.values(workouts)) {
        const ex = day.exercises.find((e) => e.id === id);
        if (ex) {
          exercises[id] = {
            weight: ex.defaults.weight,
            currentReps: ex.defaults.currentReps,
            setsDone: 0,
          };
          break;
        }
      }
      return { ...prev, exercises };
    });
  }, []);

  return { state: state.exercises, updateExercise, resetExercise };
}
