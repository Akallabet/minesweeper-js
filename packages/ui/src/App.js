import "./App.css";
import { useState } from "react";
import { start, sweep } from "logic";

function App() {
  const [game, setGame] = useState(start());

  const onClick = (x, y) => {
    const g = sweep(x, y)(game);
    setGame(g);
  };

  console.log(game);

  const { field, isGameOver } = game;

  return (
    <div className="App">
      <header className="App-header">Minesweeper</header>
      <div className="container">
        {isGameOver ? <header className="App-header">GAME OVER</header> : null}
        <div className="game" style={{ width: "120px" }}>
          <div className="header"></div>
          <div className="board">
            {field.map((row, y) => (
              <div className="row" key={y}>
                {row.map((tile, x) => (
                  <button
                    key={x}
                    className="tile"
                    onClick={() => onClick(x, y)}
                  >
                    {tile}
                  </button>
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
