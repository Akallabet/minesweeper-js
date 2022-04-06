import * as R from 'ramda';
import { start, flag, sweep } from './game';

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
    const { field } = game;

    expect(field).toEqual(getInitialMineField());
  });

  test('it returns an unchecked minefield width custom width and height', () => {
    const width = 10;
    const height = 12;
    const game = start({ width, height });
    const { field, mines } = game;

    expect(field).toEqual(getInitialMineField(width, height));
    expect(mines).toEqual(10);
  });

  test('it should flag an empty tile', () => {
    const { field, mines } = flag(5, 5)(start());

    expect(field[5][5]).toEqual('flag');
    expect(field[0]).toEqual(getInitialRow());
    expect(mines).toEqual(9);
  });

  test('it should remove a flag from a tile', () => {
    const game = flag(5, 5)(start());
    const { field, mines } = flag(5, 5)(game);

    expect(field[5][5]).toEqual(false);
    expect(field[0]).toEqual(getInitialRow());
    expect(mines).toEqual(10);
  });

  test('adds or removes a flag', () => {
    const { field, mines } = R.pipe(flag(5, 5), flag(1, 2), flag(3, 3), flag(5, 5))(start());

    expect(field[5][5]).toEqual(false);
    expect(field[2][1]).toEqual('flag');
    expect(field[3][3]).toEqual('flag');
    expect(mines).toEqual(8);
  });

  test('add 0 if there are no mines nearby', () => {
    const minesMap = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 1],
    ];

    const { field } = R.pipe(sweep(0, 1))(start({ width: 3, height: 3, mines: 2, minesMap }));
    expect(field[1][0]).toEqual(0);
  });

  test('add 1 if there is a mine nearby', () => {
    const minesMap = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 1],
    ];

    const { field } = R.pipe(sweep(1, 0))(start({ width: 3, height: 3, mines: 2, minesMap }));
    expect(field[0][1]).toEqual(1);
  });

  test('add 2 if there are two mine nearby', () => {
    const minesMap = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 1],
    ];

    const { field } = R.pipe(sweep(1, 1))(start({ width: 3, height: 3, mines: 2, minesMap }));
    expect(field[1][1]).toEqual(2);
  });

  test('swipe a small mineField', () => {
    const minesMap = [
      [0, 0, 1],
      [0, 0, 0],
      [0, 0, 1],
    ];
    const { field } = R.pipe(sweep(0, 1))(start({ width: 3, height: 3, mines: 2, minesMap }));

    expect(field[1][0]).toEqual(0);
    expect(field).toEqual([
      [0, 1, false],
      [0, 2, false],
      [0, 1, false],
    ]);
  });

  test('swipe a bigger mineField', () => {
    const minesMap = [
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { field } = R.pipe(
      sweep(0, 0),
      sweep(3, 2)
    )(start({ width: 4, height: 4, mines: 5, minesMap }));

    expect(field[0][0]).toEqual(1);
    expect(field[1][0]).toEqual(false);
    expect(field[0][1]).toEqual(false);
    expect(field[0][2]).toEqual(false);
    expect(field[1][1]).toEqual(false);
  });

  test('it should not flag a tile that has been revealed', () => {
    const minesMap = [...new Array(8)].map(() => [...new Array(8)].map(() => 0));
    const { field, mines } = R.pipe(sweep(5, 5), flag(5, 5))(start({ minesMap }));

    expect(field[5][5]).toEqual(0);
    expect(mines).toEqual(10);
  });
});
