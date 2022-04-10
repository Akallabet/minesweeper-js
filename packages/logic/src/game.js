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
  ({ field, mines, ...rest }) => ({
    field: updateTile(false, x, y)(field),
    mines: increase(mines),
    ...rest,
  });

const addFlagAndRemoveMine =
  (x, y) =>
  ({ field, mines, ...rest }) => ({
    field: updateTile('flag', x, y, field),
    mines: decrease(mines),
    ...rest,
  });

const getRandomInt = (max) => Math.floor(Math.random() * max);

const generateMinesPositions = (width, height, mines, positions = {}) => {
  if (mines === 0) {
    return R.reduce(
      (list, position) => [
        ...list,
        [Number(position.split('-')[0]), Number(position.split('-')[1])],
      ],
      [],
      R.keys(positions)
    );
  }
  const position = `${getRandomInt(height)}-${getRandomInt(width)}`;
  if (!positions[position])
    return generateMinesPositions(width, height, mines - 1, { ...positions, [position]: true });
  if (positions[position]) return generateMinesPositions(width, height, mines, positions);
};

export const createMinesMap = (width, height, mines) => {
  const minesMap = createEmptyField({ width, height }, 0);
  const minePositions = generateMinesPositions(width, height, mines);

  R.forEach(([y, x]) => (minesMap[y][x] = 1), minePositions);
  return minesMap;
};

export const flag = (x, y) =>
  R.cond([
    [R.propEq('isGameOver', true), R.identity],
    [R.propEq('isWin', true), R.identity],
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

const getIsGameOver = R.over(R.lensProp('isGameOver'), () => true);
const isSweepable = (x, y) => (args) => checkTile(false, x, y, args) && checkMines(0, x, y, args);
const getLengthOfEq = (arg, prop) =>
  R.pipe(R.prop(prop), R.flatten, R.filter(R.equals(arg)), R.length);

const getIsWin = (args) =>
  getLengthOfEq('flag', 'field')(args) + getLengthOfEq(false, 'field')(args) ===
  getLengthOfEq(1, 'minesMap')(args);

export const sweep = (x, y) =>
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
