import * as R from 'ramda';

const mapI = R.addIndex(R.map);

export const sweep = () => {};

const createMineField = ({ width = 8, height = 8 }) =>
  R.map(() => R.map(() => false, [...new Array(width)]), [...new Array(height)]);

const defaultEasy = { width: 8, height: 8, mines: 10 };

const mapDefaultArgs = ({ width = 8, height = 8, mines = 10 } = defaultEasy) => ({
  width,
  height,
  mines,
});

const addFlagToRow = (x, row) => mapI((tile, j) => (j === x ? 'flag' : tile), row);
const addFlagToField = (x, y, field) =>
  mapI((row, i) => (i === y ? addFlagToRow(x, row) : row), field);

const removeFlagFromRow = (x, row) => mapI((tile, j) => (j === x ? false : tile), row);
const removeFlagFromField = (x, y, field) =>
  mapI((row, i) => (i === y ? removeFlagFromRow(x, row) : row), field);

const checkTile =
  (arg) =>
  (x, y) =>
  ([field]) =>
    field[y][x] === arg;

const hasFlag = checkTile('flag');
const isUnchecked = checkTile(false);

const removeFlagAndAddMine =
  (x, y) =>
  ([field, mines]) =>
    [removeFlagFromField(x, y, field), mines + 1];

const addFlagAndRemoveMine =
  (x, y) =>
  ([field, mines]) =>
    [addFlagToField(x, y, field), mines - 1];

export const removeFlag = (x, y) =>
  R.cond([
    [hasFlag(x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export const addFlag = (x, y) =>
  R.cond([
    [isUnchecked(x, y), addFlagAndRemoveMine(x, y)],
    [hasFlag(x, y), R.identity],
  ]);

export const flag = (x, y) =>
  R.cond([
    [isUnchecked(x, y), addFlagAndRemoveMine(x, y)],
    [hasFlag(x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export const start = R.pipe(
  mapDefaultArgs,
  (args) => [createMineField(args), args],
  ([minefield, { mines }]) => [minefield, mines]
);
