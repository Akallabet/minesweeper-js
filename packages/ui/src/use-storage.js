import { useEffect, useMemo } from "react";

const key = "minesweeper-js";

export const useStorage = (data) => {
  useEffect(() => {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [data]);
  return () => JSON.parse(localStorage.getItem(key));
};

export const useLoadStorage = () => {
  return useMemo(() => JSON.parse(localStorage.getItem(key)), []);
};
