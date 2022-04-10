import * as R from 'ramda';
import { mapDefaultArgs, createEmptyField } from './common';

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

const createMinesMap = (width, height, mines) => {
  const minesMap = createEmptyField({ width, height }, 0);
  const minePositions = generateMinesPositions(width, height, mines);

  R.forEach(([y, x]) => (minesMap[y][x] = 1), minePositions);
  return minesMap;
};

const start = R.pipe(
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

export default start;
