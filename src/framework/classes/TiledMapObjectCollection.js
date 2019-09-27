// @flow

import Exception from "./Exception";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapObject } from "../interfaces/TiledMapObject";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";

export default class TiledMapObjectCollection<T: TiledMapObject> implements TiledMapObjectCollectionInterface<T> {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledMapObjects: $ReadOnlyArray<T>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tiledMapObjects: $ReadOnlyArray<T>): void {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMapObjects = tiledMapObjects;
  }

  asArray(): $ReadOnlyArray<T> {
    return this.tiledMapObjects;
  }

  item(index: number): T {
    const ret = this.tiledMapObjects[index];

    if ("undefined" === typeof ret) {
      const breadcrumbs = this.loggerBreadcrumbs.add("item").addVariable(String(index));

      throw new Exception(breadcrumbs, "Requested object does not exist.");
    }

    return ret;
  }
}
