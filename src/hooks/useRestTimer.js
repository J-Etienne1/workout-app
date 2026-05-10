import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_REST = 60;

export function useRestTimer() {
  const [endsAt, setEndsAt] = useState(null);
  const [duration, setDuration] = useState(DEFAULT_REST);
  const [now, setNow] = useState(() => Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [endsAt]);

  const remainingMs = endsAt === null ? null : endsAt - now;

  useEffect(() => {
    if (endsAt === null || firedRef.current) return;
    if (remainingMs !== null && remainingMs <= 0) {
      firedRef.current = true;
      setEndsAt(null);
    }
  }, [remainingMs, endsAt]);

  const start = useCallback((seconds = DEFAULT_REST) => {
    firedRef.current = false;
    setDuration(seconds);
    setEndsAt(Date.now() + seconds * 1000);
  }, []);

  const skip = useCallback(() => {
    firedRef.current = true;
    setEndsAt(null);
  }, []);

  const reset = useCallback(() => {
    firedRef.current = false;
    setEndsAt(Date.now() + duration * 1000);
  }, [duration]);

  const secondsLeft =
    remainingMs === null ? null : Math.max(0, Math.ceil(remainingMs / 1000));

  return { secondsLeft, duration, start, skip, reset };
}
