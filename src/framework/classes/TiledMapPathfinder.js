// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledMap } from "../interfaces/TiledMap";
import type { TiledMapPathfinder as TiledMapPathfinderInterface } from "../interfaces/TiledMapPathfinder";

export default class TiledMapPathfinder implements TiledMapPathfinderInterface {
  +tiledMap: TiledMap;

  constructor(tiledMap: TiledMap) {
    this.tiledMap = tiledMap;
  }

  async findPath(
    start: ElementPosition<"tile">,
    end: ElementPosition<"tile">
  ): Promise<$ReadOnlyArray<ElementPosition<"tile">>> {
    return [];
  }
}
