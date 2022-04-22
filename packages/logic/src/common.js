import * as R from 'ramda';

export const createEmptyField = R.curry(({ columns = 8, rows = 8 }, value) => {
  return R.map(() => R.map(() => value, [...new Array(columns)]), [...new Array(rows)]);
});

export const checkField = R.curryN(4)((arg, x, y, field) => field[y] && field[y][x] === arg);
export const checkTile = R.curryN(4)((arg, x, y, { field }) => checkField(arg, x, y, field));

const mapI = R.addIndex(R.map);
const updateRowTile = (arg, x, row) => mapI((tile, j) => (j === x ? arg : tile), row);
export const updateTile = R.curryN(4)((arg, x, y, field) =>
  mapI((row, i) => (i === y ? updateRowTile(arg, x, row) : row), field)
);

export const increase = R.add(1);
export const decrease = R.subtract(R.__, 1);
