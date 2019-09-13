// @flow

import type { TiledMapObject } from "../interfaces/TiledMapObject";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";

export default class TiledMapObjectCollection<T: TiledMapObject> implements TiledMapObjectCollectionInterface<T> {
  +tiledMapObjects: $ReadOnlyArray<T>;

  constructor(tiledMapObjects: $ReadOnlyArray<T>): void {
    this.tiledMapObjects = tiledMapObjects;
  }

  asArray(): $ReadOnlyArray<T> {
    return this.tiledMapObjects;
  }
}
