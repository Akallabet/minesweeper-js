import * as R from 'ramda';
import { mapDefaultArgs, createEmptyField } from './common';

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

const createMinesMap = (columns, rows, mines) => {
  const minesMap = createEmptyField({ columns, rows }, 0);
  const minePositions = generateMinesPositions(columns, rows, mines);

  R.forEach(([y, x]) => (minesMap[y][x] = 1), minePositions);
  return minesMap;
};

const start = R.pipe(
  mapDefaultArgs,
  (args) => [createEmptyField(args, false), args],
  ([field, { mines, minesMap, columns, rows, ...rest }]) => ({
    field,
    mines,
    columns,
    rows,
    minesMap: minesMap || createMinesMap(columns, rows, mines),
    ...rest,
  })
);

export default start;
