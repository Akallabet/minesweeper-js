const Tile = ({ tile, onSweep, onFlag, disabled }) => {
  return (
    ((tile === false || tile === "flag") && (
      <button
        className="tile"
        onClick={onSweep}
        onContextMenu={onFlag}
        disabled={disabled}
      >
        {(tile === "flag" && "!") || tile}
      </button>
    )) || <p className="tile">{tile}</p>
  );
};

export default Tile;
