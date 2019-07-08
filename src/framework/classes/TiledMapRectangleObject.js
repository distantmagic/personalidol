// @flow

import type { TiledMapBlockObject } from "../interfaces/TiledMapBlockObject";
import type { TiledMapRectangleObject as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapRectangleObject";

export default class TiledMapRectangleObject implements TiledMapRectangleObjectInterface {
  +isEllipse: false;
  +isPolygon: false;
  +isRectangle: true;
  +tiledMapBlockObject: TiledMapBlockObject;

  isEllipse = false;
  isPolygon = false;
  isRectangle = true;

  constructor(tiledMapBlockObject: TiledMapBlockObject): void {
    this.tiledMapBlockObject = tiledMapBlockObject;
  }

  getTiledMapBlockObject(): TiledMapBlockObject {
    return this.tiledMapBlockObject;
  }

  isEqual(other: TiledMapRectangleObjectInterface): boolean {
    return this.getTiledMapBlockObject().isEqual(other.getTiledMapBlockObject());
  }
}
