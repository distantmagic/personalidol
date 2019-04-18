// @flow

import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";

type TiledMapArray = Array<Array<number>>;

export default class TiledMapGrid implements TiledMapGridInterface {
  +grid: TiledMapArray;

  constructor(grid: TiledMapArray): void {
    this.grid = grid;
  }
}
