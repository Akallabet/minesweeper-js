import "./App.css";
import { useState } from "react";
import { flag, start, sweep } from "logic";
import Tile from "./tile";

function App() {
  const [game, setGame] = useState(start());

  const onSweep = (x, y) => () => setGame(sweep(x, y)(game));

  const onFlag = (x, y) => (e) => {
    e.preventDefault();
    setGame(flag(x, y)(game));
  };

  const onReset = () => setGame(start());

  const { field, minesMap, mines, isGameOver, isWin } = game;

  return (
    <div className="App">
      <header className="App-header">Minesweeper</header>
      <div className="container">
        <header className="game-feedback">
          {(isGameOver && <p>GAME OVER</p>) ||
            (isWin && <p>Victory!</p>) ||
            null}
        </header>
        <div className="game" style={{ width: "120px" }}>
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
      </div>
    </div>
  );
}

export default App;
