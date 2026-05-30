import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRestTimer, REST_PRESETS } from "./useRestTimer.js";

describe("useRestTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const advance = (ms) => act(() => vi.advanceTimersByTime(ms));

  it("starts idle with the default duration", () => {
    const { result } = renderHook(() => useRestTimer());
    expect(result.current.secondsLeft).toBeNull();
    expect(result.current.duration).toBe(60);
  });

  it("counts down after start", () => {
    const { result } = renderHook(() => useRestTimer());

    act(() => result.current.start(60));
    expect(result.current.secondsLeft).toBe(60);

    advance(1000);
    expect(result.current.secondsLeft).toBe(59);

    advance(9000);
    expect(result.current.secondsLeft).toBe(50);
  });

  it("hides itself when it reaches zero", () => {
    const { result } = renderHook(() => useRestTimer());

    act(() => result.current.start(5));
    advance(5000);

    expect(result.current.secondsLeft).toBeNull();
  });

  it("skip ends the timer immediately", () => {
    const { result } = renderHook(() => useRestTimer());

    act(() => result.current.start(60));
    advance(2000);
    act(() => result.current.skip());

    expect(result.current.secondsLeft).toBeNull();
  });

  it("reset restarts the countdown at the current duration", () => {
    const { result } = renderHook(() => useRestTimer());

    act(() => result.current.start(60));
    advance(40000);
    expect(result.current.secondsLeft).toBe(20);

    act(() => result.current.reset());
    expect(result.current.secondsLeft).toBe(60);
  });

  it("choosePreset restarts at the chosen length and remembers it", () => {
    const { result } = renderHook(() => useRestTimer());

    act(() => result.current.start(60));
    advance(10000);

    act(() => result.current.choosePreset(90));
    expect(result.current.duration).toBe(90);
    expect(result.current.secondsLeft).toBe(90);

    // The next set (start with no argument) should reuse the chosen length.
    advance(90000); // let it finish
    act(() => result.current.start());
    expect(result.current.secondsLeft).toBe(90);
  });

  it("exposes the expected presets", () => {
    expect(REST_PRESETS).toEqual([60, 75, 90]);
  });
});
