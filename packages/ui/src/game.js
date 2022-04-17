import { useEffect, useState } from "react";
import { flag, start, sweep, levels } from "logic";
import Tile from "./tile";

const Game = ({ level = "beginner" }) => {
  const gameLevel = levels.find(([gameLevel]) => gameLevel === level)[1];

  const [game, setGame] = useState(start(gameLevel));

  useEffect(() => {
    setGame(start(gameLevel));
  }, [gameLevel]);

  const onSweep = (x, y) => () => setGame(sweep(x, y)(game));

  const onFlag = (x, y) => (e) => {
    e.preventDefault();
    setGame(flag(x, y)(game));
  };

  const onReset = () => setGame(start(gameLevel));

  const { field, minesMap, mines, isGameOver, isWin, columns } = game;

  const tileWidth = 16;

  const width = tileWidth * columns;

  return (
    <>
      <header className="game-feedback">
        {(isGameOver && <p>GAME OVER</p>) || (isWin && <p>Victory!</p>) || null}
      </header>
      <div className="game" style={{ width: `${width}px` }}>
        <div className="header">
          <div>
            <span>Mines: </span>
            <span>{mines}</span>
          </div>
          <button onClick={onReset}>reset</button>
        </div>
        <div className="board">
          {field.map((row, y) => (
            <div className="row" key={y}>
              {row.map((tile, x) => (
                <Tile
                  key={x}
                  tile={(isGameOver && minesMap[y][x] && "*") || tile}
                  disabled={isGameOver}
                  onSweep={onSweep(x, y)}
                  onFlag={onFlag(x, y)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Game;
