import { useParams } from "react-router-dom";
import Game from "./game";

const GameRoute = () => {
  const { level } = useParams();
  return <Game level={level} />;
};

export default GameRoute;
