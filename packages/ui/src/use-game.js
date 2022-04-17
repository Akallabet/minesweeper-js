import { useEffect, useState } from "react";
import { start, levels } from "logic";
import { useLoadStorage, useStorage } from "./use-storage";

const useGame = (level) => {
  const data = useLoadStorage();
  const isSameLevel = data && data.level === level;
  const gameLevel = levels.find(([gameLevel]) => gameLevel === level)[1];

  const getInitialGame = () => {
    if (isSameLevel) return data.game;
    return start(gameLevel);
  };

  const [game, setGame] = useState(getInitialGame);

  useEffect(() => {
    if (isSameLevel) setGame(data.game);
    else setGame(start(gameLevel));
  }, [data, isSameLevel, gameLevel]);

  useStorage({ game, level });

  return [game, setGame];
};

export default useGame;
