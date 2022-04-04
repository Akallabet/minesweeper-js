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

const checkField = R.curryN(4)((arg, x, y, field) => field[y] && field[y][x] === arg);

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

const getNeighbours = (x, y) => [
  [y - 1, x],
  [y - 1, x + 1],
  [y, x + 1],
  [y + 1, x + 1],
  [y + 1, x],
  [y + 1, x - 1],
  [y, x - 1],
  [y - 1, x - 1],
];
const calcNeighbouringMines = (minesMap) =>
  R.pipe(
    getNeighbours,
    R.map(([y, x]) => checkField(1, x, y, minesMap)),
    R.reduce((mines, isMine) => (isMine ? increase(mines) : mines), 0)
  );

const getEmptyNeighbours = (minesMap) =>
  R.pipe(
    getNeighbours,
    R.filter(([y, x]) => checkField(0, x, y, minesMap))
  );

const sweepTile = (field, minesMap, [current, ...neighbours] = []) => {
  if (!current) return field;
  const [y, x] = current;
  if (!minesMap[y] || minesMap[y][x] === undefined) sweepTile(field, minesMap, neighbours);
  // console.log({ y, x });
  if (checkField(0, x, y, minesMap)) {
    // console.log(minesMap[y][x]);
    // console.log(getEmptyNeighbours(minesMap)(x, y));
    return sweepTile(
      updateTile(calcNeighbouringMines(minesMap)(x, y), x, y, field),
      minesMap,
      // getEmptyNeighbours(minesMap)(x, y),
      neighbours
    );
  }

  return field;
};

const startSweep =
  (x, y) =>
  ([field, mines, minesMap]) =>
    [sweepTile(field, minesMap, [[y, x], ...getNeighbours(x, y)]), mines, minesMap];

export const sweep = (x, y) =>
  R.cond([
    [R.when(checkTile(false, x, y), checkMines(0, x, y)), startSweep(x, y)],
    [R.always, R.identity],
  ]);
