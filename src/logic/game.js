import * as R from 'ramda';

const mapI = R.addIndex(R.map);
const increase = R.add(1);
const decrease = R.subtract(R.__, 1);

const defaultEasy = { width: 8, height: 8, mines: 10 };

const mapDefaultArgs = ({ width = 8, height = 8, mines = 10, minesMap } = defaultEasy) => ({
  width,
  height,
  mines,
  minesMap,
});

const createEmptyField = ({ width = 8, height = 8 }) =>
  R.map(() => R.map(() => false, [...new Array(width)]), [...new Array(height)]);

const checkField = R.curryN(4)((arg, x, y, field) => field[y][x] === arg);

const checkMines = R.curryN(4)((arg, x, y, [_, __, minesMap]) => checkField(arg, x, y, minesMap));
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

const createMinesMap = () => [];

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
  (args) => [createEmptyField(args), args],
  ([minefield, { mines, minesMap }]) => [
    minefield,
    mines,
    minesMap || createMinesMap(minefield, mines),
  ]
);

const sweepTile = (field, minesMap, x, y) => {
  // if (minesMap[x+1][y]) updateTile(0, x, y, field);
  if (checkField(1, x, y, minesMap)) return updateTile(true, x, y, field);
  if (checkField(0, x, y, minesMap)) return updateTile(0, x, y, field);
  // sweepTile(updateTile(1, x, y, field), minesMap, x, y)

  return field;
};

const startSweep =
  (x, y) =>
  ([field, mines, minesMap]) =>
    [sweepTile(field, minesMap, x, y), mines, minesMap];

export const sweep = (x, y) =>
  R.cond([
    [R.when(checkTile(false, x, y), checkMines(0, x, y)), startSweep(x, y)],
    [R.always, R.identity],
  ]);
