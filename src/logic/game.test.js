import * as R from 'ramda';
import { start, addFlag, removeFlag, flag, sweep } from './game';

const getInitialRow = (width = 8) => [...new Array(width)].map(() => false);
const getInitialMineField = (width = 8, height = 8) =>
  [...new Array(height)].map(() => getInitialRow(width));

describe('Game', () => {
  test('start a game', () => {
    const game = start();
    expect(game).not.toBeUndefined();
  });

  test('it returns a minefield where all the tiles are not revealed', () => {
    const game = start();
    const [field] = game;

    expect(field).toEqual(getInitialMineField());
  });

  test('it returns an unchecked minefield width custom width and height', () => {
    const width = 10;
    const height = 12;
    const game = start({ width, height });
    const [field, mines] = game;

    expect(field).toEqual(getInitialMineField(width, height));
    expect(mines).toEqual(10);
  });

  test('it should flag an empty tile', () => {
    const [field, mines] = addFlag(5, 5)(start());

    expect(field[5][5]).toEqual('flag');
    expect(field[0]).toEqual(getInitialRow());
    expect(mines).toEqual(9);
  });

  test('it should remove a flag from a tile', () => {
    const game = addFlag(5, 5)(start());
    const [field, mines] = removeFlag(5, 5)(game);

    expect(field[5][5]).toEqual(false);
    expect(field[0]).toEqual(getInitialRow());
    expect(mines).toEqual(10);
  });

  // test('it should not flag a non empty tile', () => {
  //   const [field, mines] = R.pipe(addFlag(5, 5), addFlag(5, 5))(start());

  //   expect(field[5][5]).toEqual('flag');
  //   expect(mines).toEqual(9);
  // });

  test('it should not remove a flag if the tile does not contain a flag already', () => {
    const [field, mines] = R.pipe(addFlag(5, 5), removeFlag(1, 2))(start());

    expect(field[5][5]).toEqual('flag');
    expect(field[2][1]).toEqual(false);
    expect(mines).toEqual(9);
  });

  test('adds or removes a flag', () => {
    const [field, mines] = R.pipe(flag(5, 5), flag(1, 2), flag(3, 3), flag(5, 5))(start());

    expect(field[5][5]).toEqual(false);
    expect(field[2][1]).toEqual('flag');
    expect(field[3][3]).toEqual('flag');
    expect(mines).toEqual(8);
  });

  test('sweep an empty tile', () => {
    const minesMap = [
      [1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const [field] = R.pipe(sweep(3, 4))(start({ width: 8, height: 8, mines: 10, minesMap }));
    expect(field[4][3]).toEqual(0);
  });

  test('swipe a small mineField', () => {
    const mineField = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const minesMap = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 1],
    ];
    const [field] = R.pipe(sweep(0, 0))(start({ width: 3, height: 3, mines: 2, minesMap }));
    expect(field).toEqual([
      [0, 1, false],
      [0, 2, false],
      [0, 1, false],
    ]);
  });

  // test('when sweeping an empty tile, it reveals all the tiles which do not touch a mine', () => {
  //   const minesMap = [
  //     [1, 0, 0, 0, 0, 0, 1, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 0],
  //     [0, 1, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 1, 0],
  //     [1, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 0, 0, 0, 0, 0, 1],
  //     [0, 0, 0, 0, 1, 1, 0, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ];
  //   const [field] = R.pipe(sweep(3, 4))(start({ width: 8, height: 8, mines: 10, minesMap }));
  //   expect(field[4][3]).toEqual(0);
  // });
});
