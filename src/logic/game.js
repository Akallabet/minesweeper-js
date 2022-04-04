import * as R from 'ramda';

const mapI = R.addIndex(R.map);
const increase = R.add(1);
const decrease = R.subtract(R.__, 1);

const createMineField = ({ width = 8, height = 8 }) =>
  R.map(() => R.map(() => false, [...new Array(width)]), [...new Array(height)]);

const defaultEasy = { width: 8, height: 8, mines: 10 };

const mapDefaultArgs = ({ width = 8, height = 8, mines = 10 } = defaultEasy) => ({
  width,
  height,
  mines,
});

const checkTile = R.curryN(4)((arg, x, y, [field]) => field[y][x] === arg);
const updateRowTile = (arg, x, row) => mapI((tile, j) => (j === x ? arg : tile), row);
const updateTile = R.curryN(4)((arg, x, y, field) =>
  mapI((row, i) => (i === y ? updateRowTile(arg, x, row) : row), field)
);

const removeFlagAndAddMine =
  (x, y) =>
  ([field, mines]) =>
    [updateTile(false, x, y)(field), increase(mines)];

const addFlagAndRemoveMine =
  (x, y) =>
  ([field, mines]) =>
    [updateTile('flag', x, y, field), decrease(mines)];

export const removeFlag = (x, y) =>
  R.cond([
    [checkTile('flag', x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export const addFlag = (x, y) =>
  R.cond([
    [checkTile(false, x, y), addFlagAndRemoveMine(x, y)],
    [checkTile('flag', x, y), R.identity],
  ]);

export const flag = (x, y) =>
  R.cond([
    [checkTile(false, x, y), addFlagAndRemoveMine(x, y)],
    [checkTile('flag', x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export const start = R.pipe(
  mapDefaultArgs,
  (args) => [createMineField(args), args],
  ([minefield, { mines }]) => [minefield, mines]
);

export const sweep = () => {};
