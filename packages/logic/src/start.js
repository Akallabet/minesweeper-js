import * as R from 'ramda';
import { createEmptyField } from './common';

const defaultEasy = { columns: 9, rows: 9, mines: 8 };

const mapDefaultArgs = ({ columns = 8, rows = 8, mines = 10, ...rest } = defaultEasy) => ({
  columns,
  rows,
  mines,
  ...rest,
});

const getRandomInt = (max) => Math.floor(Math.random() * max);

const generateMinesPositions = (columns, rows, mines, positions = {}) => {
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
  const position = `${getRandomInt(rows)}-${getRandomInt(columns)}`;
  if (!positions[position])
    return generateMinesPositions(columns, rows, mines - 1, { ...positions, [position]: true });
  if (positions[position]) return generateMinesPositions(columns, rows, mines, positions);
};

const createMinesMap = ({ columns, rows, mines }) => {
  const minesMap = createEmptyField({ columns, rows }, 0);
  const minePositions = generateMinesPositions(columns, rows, mines);

  R.forEach(([y, x]) => (minesMap[y][x] = 1), minePositions);
  return minesMap;
};

const start = R.pipe(
  mapDefaultArgs,
  R.cond([
    [R.prop('field'), R.identity],
    [R.always, (args) => ({ field: createEmptyField(args, false), ...args })],
  ]),
  R.cond([
    [R.prop('minesMap'), R.identity],
    [R.always, (args) => ({ minesMap: createMinesMap(args), ...args })],
  ])
);

export default start;
