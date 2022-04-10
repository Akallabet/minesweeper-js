import * as R from 'ramda';
import { checkField, checkTile, increase, updateTile } from './common';

const checkMines = R.curryN(4)((arg, x, y, { minesMap }) => checkField(arg, x, y, minesMap));

const getNeighbourPositions = (x, y) => [
  [y - 1, x],
  [y - 1, x + 1],
  [y, x + 1],
  [y + 1, x + 1],
  [y + 1, x],
  [y + 1, x - 1],
  [y, x - 1],
  [y - 1, x - 1],
];
const calcNeighbourMines = (minesMap) =>
  R.pipe(
    getNeighbourPositions,
    R.map(([y, x]) => checkField(1, x, y, minesMap)),
    R.reduce((mines, isMine) => (isMine ? increase(mines) : mines), 0)
  );

const getEmptyUncheckedNeighbours = (field, minesMap) =>
  R.pipe(
    getNeighbourPositions,
    R.filter(([y, x]) => checkField(false, x, y, field)),
    R.filter(([y, x]) => checkField(0, x, y, minesMap))
  );

const sweepTile = (field, minesMap, [current, ...neighbours] = []) => {
  if (!current) return field;
  const [y, x] = current;
  if (!minesMap[y] || minesMap[y][x] === undefined) sweepTile(field, minesMap, neighbours);

  if (checkField(0, x, y, minesMap)) {
    const neighbouringMines = calcNeighbourMines(minesMap)(x, y);
    return sweepTile(
      updateTile(neighbouringMines, x, y, field),
      minesMap,
      neighbouringMines === 0
        ? [...getEmptyUncheckedNeighbours(field, minesMap)(x, y), ...neighbours]
        : neighbours
    );
  }
  return field;
};

const startSweep =
  (x, y) =>
  ({ field, mines, minesMap, ...rest }) => {
    const neighbouringMines = calcNeighbourMines(minesMap)(x, y);
    return {
      field: sweepTile(
        updateTile(neighbouringMines, x, y, field),
        minesMap,
        neighbouringMines === 0 ? getEmptyUncheckedNeighbours(field, minesMap)(x, y) : []
      ),
      mines,
      minesMap,
      ...rest,
    };
  };

const getIsGameOver = R.over(R.lensProp('isGameOver'), () => true);
const isSweepable = (x, y) => (args) => checkTile(false, x, y, args) && checkMines(0, x, y, args);
const getLengthOfEq = (arg, prop) =>
  R.pipe(R.prop(prop), R.flatten, R.filter(R.equals(arg)), R.length);

const getIsWin = (args) =>
  getLengthOfEq('flag', 'field')(args) + getLengthOfEq(false, 'field')(args) ===
  getLengthOfEq(1, 'minesMap')(args);

const sweep = (x, y) =>
  R.pipe(
    R.cond([
      [R.propEq('isGameOver', true), R.identity],
      [R.propEq('isWin', true), R.identity],
      [checkTile('flag', x, y), R.identity],
      [checkMines(1, x, y), getIsGameOver],
      [isSweepable(x, y), startSweep(x, y)],
      [R.always, R.identity],
    ]),
    (args) => ({ ...args, isWin: getIsWin(args) })
  );

export default sweep;
