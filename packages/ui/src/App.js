import { Link, Route, Routes } from "react-router-dom";
import { levels } from "logic";
import "./App.css";
import Game from "./game";
import GameRoute from "./game-route";

function App() {
  return (
    <div className="App">
      <header className="App-header">Minesweeper</header>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "300px",
          }}
        >
          {levels.map(([level]) => (
            <Link key={level} to={`/levels/${level}`}>
              {level}
            </Link>
          ))}
        </div>
        <Routes>
          <Route path="/" element={<Game level="beginner" />} />
          <Route path="/levels/:level" element={<GameRoute />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
