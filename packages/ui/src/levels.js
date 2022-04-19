import { Link, useLocation } from "react-router-dom";

const Levels = ({ levels = [] }) => {
  const { pathname } = useLocation();
  return levels.map(([level]) => (
    <Link
      key={level}
      to={`/levels/${level}`}
      className={level === pathname.replace("/levels/", "") ? "selected" : ""}
    >
      {level}
    </Link>
  ));
};

export default Levels;
