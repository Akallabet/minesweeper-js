import { useEffect, useRef, useState } from "react";

export const useTimer = (
  initialTime = 0,
  isStart = false,
  isPaused = false
) => {
  const [time, setTime] = useState(initialTime);
  const interval = useRef();

  const reset = () => setTime(0);

  useEffect(() => {
    if (isStart && !isPaused) {
      if (interval.current) clearTimeout(interval.current);
      interval.current = setTimeout(() => {
        setTime(Number(time) + 1);
      }, 1000);
    }
    return () => {
      if (interval.current) {
        clearTimeout(interval.current);
      }
    };
  }, [isStart, isPaused, time]);

  return [time, reset];
};
