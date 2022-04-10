import * as R from 'ramda';
import { checkTile, updateTile, increase, decrease } from './common';

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

const flag = (x, y) =>
  R.cond([
    [R.propEq('isGameOver', true), R.identity],
    [R.propEq('isWin', true), R.identity],
    [checkTile(false, x, y), addFlagAndRemoveMine(x, y)],
    [checkTile('flag', x, y), removeFlagAndAddMine(x, y)],
    [R.always, R.identity],
  ]);

export default flag;
