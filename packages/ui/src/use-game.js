import { useEffect, useState } from "react";
import { start, levels } from "logic";
import { useLoadStorage, useStorage } from "./use-storage";
import { useTimer } from "./timer";

const useGame = (level) => {
  const data = useLoadStorage();
  const isSameLevel = data && data.level === level;
  const gameLevel = levels.find(([gameLevel]) => gameLevel === level)[1];

  const getInitialGame = () => {
    if (isSameLevel) return data.game;
    return start(gameLevel);
  };

  const [isStart, setIsStart] = useState(false);
  const [game, setGame] = useState(getInitialGame);
  const { isGameOver, isWin } = game;

  const [time, resetTime] = useTimer(data.time, isStart, isGameOver || isWin);

  useEffect(() => {
    if (isSameLevel) setGame(data.game);
    else setGame(start(gameLevel));
  }, [data, isSameLevel, gameLevel]);

  useStorage({ game, level, time });

  const gameAction = (args) => {
    setGame(args);
    setIsStart(true);
  };

  const resetGame = () => {
    setGame(start(gameLevel));
    setIsStart(false);
    resetTime();
  };

  return [game, time, gameAction, resetGame];
};

export default useGame;
