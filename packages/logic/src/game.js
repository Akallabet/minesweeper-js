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

const createEmptyField = R.curry(({ width = 8, height = 8 }, value) =>
  R.map(() => R.map(() => value, [...new Array(width)]), [...new Array(height)])
);

const checkField = R.curryN(4)((arg, x, y, field) => field[y] && field[y][x] === arg);
const checkMines = R.curryN(4)((arg, x, y, { minesMap }) => checkField(arg, x, y, minesMap));
const checkTile = R.curryN(4)((arg, x, y, { field }) => field[y][x] === arg);
const updateRowTile = (arg, x, row) => mapI((tile, j) => (j === x ? arg : tile), row);
const updateTile = R.curryN(4)((arg, x, y, field) =>
  mapI((row, i) => (i === y ? updateRowTile(arg, x, row) : row), field)
);

const removeFlagAndAddMine =
  (x, y) =>
  ({ field, mines }) => ({ field: updateTile(false, x, y)(field), mines: increase(mines) });

const addFlagAndRemoveMine =
  (x, y) =>
  ({ field, mines }) => ({ field: updateTile('flag', x, y, field), mines: decrease(mines) });

const getRandomInt = (max) => Math.floor(Math.random() * max);

const createMinesMap = (width, height, mines) => {
  const minePositions = R.map(
    () => [getRandomInt(height), getRandomInt(width)],
    [...new Array(mines)]
  );
  const minesMap = createEmptyField({ width, height }, 0);
  R.forEach(([y, x]) => (minesMap[y][x] = 1), minePositions);
  return minesMap;
};

export const flag = (x, y) =>
  R.cond([
    [R.propEq('isGameOver', true), R.identity],
    [checkTile(false, x, y), addFlagAndRemoveMine(x, y)],
    [checkTile('flag', x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export const start = R.pipe(
  mapDefaultArgs,
  (args) => [createEmptyField(args, false), args],
  ([field, { mines, minesMap, width, height, ...rest }]) => ({
    field,
    mines,
    width,
    height,
    minesMap: minesMap || createMinesMap(width, height, mines),
    ...rest,
  })
);

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

const gameOver = (args) => ({ ...args, isGameOver: true });

export const sweep = (x, y) =>
  R.cond([
    [R.propEq('isGameOver', true), R.identity],
    [checkMines(1, x, y), gameOver],
    [R.when(checkTile(false, x, y), checkMines(0, x, y)), startSweep(x, y)],
    [R.always, R.identity],
  ]);
