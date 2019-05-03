// @flow

import type { TiledMapBlockObject } from "../interfaces/TiledMapBlockObject";
import type { TiledMapRectangleObject as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapRectangleObject";
import type { TiledMapRectangleObjectSerializedObject } from "../types/TiledMapRectangleObjectSerializedObject";

export default class TiledMapRectangleObject
  implements TiledMapRectangleObjectInterface {
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

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapRectangleObjectSerializedObject {
    return {
      isEllipse: false,
      isPolygon: false,
      isRectangle: true,
      tiledMapBlockObject: this.tiledMapBlockObject.asObject()
    };
  }

  getTiledMapBlockObject(): TiledMapBlockObject {
    return this.tiledMapBlockObject;
  }
}
