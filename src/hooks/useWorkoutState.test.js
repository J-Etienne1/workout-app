import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useWorkoutState } from "./useWorkoutState.js";
import { workouts } from "../data/workouts.js";

const STORAGE_KEY = "workout-app:state";
// A real exercise id + its defaults, taken from the data so the tests don't
// hard-code numbers that might drift.
const SAMPLE = workouts.saturday.exercises[0];

describe("useWorkoutState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T10:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("seeds defaults when nothing is stored", () => {
    const { result } = renderHook(() => useWorkoutState());
    expect(result.current.state[SAMPLE.id]).toEqual({
      weight: SAMPLE.defaults.weight,
      currentReps: SAMPLE.defaults.currentReps,
      setsDone: 0,
    });
  });

  it("migrates the old flat storage format, preserving saved weights", () => {
    // Pre-v2 data: the whole object was the exercises map, no setsDone/sessionDate.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ [SAMPLE.id]: { weight: 42.5, currentReps: 8 } })
    );

    const { result } = renderHook(() => useWorkoutState());

    expect(result.current.state[SAMPLE.id]).toEqual({
      weight: 42.5,
      currentReps: 8,
      setsDone: 0,
    });
  });

  it("keeps set progress within the same day", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        exercises: { [SAMPLE.id]: { weight: 42.5, currentReps: 8, setsDone: 2 } },
        sessionDate: "2026-5-30", // matches the mocked system date
      })
    );

    const { result } = renderHook(() => useWorkoutState());
    expect(result.current.state[SAMPLE.id].setsDone).toBe(2);
  });

  it("clears set progress on a new day but keeps weight/reps", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        exercises: { [SAMPLE.id]: { weight: 42.5, currentReps: 8, setsDone: 3 } },
        sessionDate: "2026-5-29", // the day before
      })
    );

    const { result } = renderHook(() => useWorkoutState());
    expect(result.current.state[SAMPLE.id]).toEqual({
      weight: 42.5,
      currentReps: 8,
      setsDone: 0,
    });
  });

  it("updateExercise patches one exercise and persists it", () => {
    const { result } = renderHook(() => useWorkoutState());

    act(() => result.current.updateExercise(SAMPLE.id, { weight: 20, setsDone: 1 }));
    expect(result.current.state[SAMPLE.id].weight).toBe(20);
    expect(result.current.state[SAMPLE.id].setsDone).toBe(1);

    // Flush the debounced write.
    act(() => vi.advanceTimersByTime(250));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.exercises[SAMPLE.id].weight).toBe(20);
    expect(saved.sessionDate).toBe("2026-5-30");
  });

  it("resetExercise restores defaults and clears sets", () => {
    const { result } = renderHook(() => useWorkoutState());

    act(() =>
      result.current.updateExercise(SAMPLE.id, { weight: 99, setsDone: 4 })
    );
    act(() => result.current.resetExercise(SAMPLE.id));

    expect(result.current.state[SAMPLE.id]).toEqual({
      weight: SAMPLE.defaults.weight,
      currentReps: SAMPLE.defaults.currentReps,
      setsDone: 0,
    });
  });
});
