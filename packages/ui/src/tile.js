const Tile = ({ tile, onSweep, onFlag, disabled }) =>
  ((tile === false || tile === "flag") && (
    <button
      className="tile"
      onClick={onSweep}
      onContextMenu={onFlag}
      disabled={disabled}
    >
      {(tile === "flag" && "!") || tile}
    </button>
  )) || (
    <p className="tile">
      {Boolean(tile) ? <span className={`tile-${tile}`}>{tile}</span> : ""}
    </p>
  );

export default Tile;
