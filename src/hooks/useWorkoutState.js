import { useCallback, useEffect, useRef, useState } from "react";
import { workouts } from "../data/workouts.js";

const STORAGE_KEY = "workout-app:state";

function buildInitialState() {
  const state = {};
  for (const day of Object.values(workouts)) {
    for (const ex of day.exercises) {
      state[ex.id] = {
        weight: ex.defaults.weight,
        currentReps: ex.defaults.currentReps,
      };
    }
  }
  return state;
}

function loadState() {
  const initial = buildInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const saved = JSON.parse(raw);
    return { ...initial, ...saved };
  } catch {
    return initial;
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
    setState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const resetExercise = useCallback((id) => {
    setState((prev) => {
      const next = { ...prev };
      for (const day of Object.values(workouts)) {
        const ex = day.exercises.find((e) => e.id === id);
        if (ex) {
          next[id] = {
            weight: ex.defaults.weight,
            currentReps: ex.defaults.currentReps,
          };
          break;
        }
      }
      return next;
    });
  }, []);

  return { state, updateExercise, resetExercise };
}
