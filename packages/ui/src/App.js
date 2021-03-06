import { Route, Routes } from "react-router-dom";
import { levels } from "logic";
import "./App.css";
import Game from "./game";
import GameRoute from "./game-route";
import Levels from "./levels";

const App = () => (
  <>
    <header>
      <h1>Minesweeper</h1>
    </header>
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "300px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Levels levels={levels} />
      </div>
      <Routes>
        <Route path="/" element={<Game level="beginner" />} />
        <Route path="/levels/:level" element={<GameRoute />} />
      </Routes>
    </div>
    <footer>
      <section>
        <p>
          <span>Made by</span>
          <a href="https://github.com/Akallabet">Akallabet</a>
        </p>
        <a href="https://github.com/Akallabet/minesweeper-js">Github Repo</a>
      </section>
    </footer>
  </>
);

export default App;
