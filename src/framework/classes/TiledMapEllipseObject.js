// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapBlockObject } from "../interfaces/TiledMapBlockObject";
import type { TiledMapEllipseObject as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapEllipseObject";
import type { TiledMapEllipseObjectSerializedObject } from "../types/TiledMapEllipseObjectSerializedObject";

export default class TiledMapEllipseObject implements TiledMapEllipseObjectInterface {
  +isEllipse: true;
  +isPolygon: false;
  +isRectangle: false;
  +tiledMapBlockObject: TiledMapBlockObject;

  isEllipse = true;
  isPolygon = false;
  isRectangle = false;

  constructor(tiledMapBlockObject: TiledMapBlockObject): void {
    const elementSize = tiledMapBlockObject.getElementSize();

    if (elementSize.getHeight() !== elementSize.getWidth()) {
      throw new Error(
        "Ellipses are not supported. You have to use circles instead."
      );
    }

    this.tiledMapBlockObject = tiledMapBlockObject;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapEllipseObjectSerializedObject {
    return {
      isEllipse: true,
      isPolygon: false,
      isRectangle: false,
      tiledMapBlockObject: this.tiledMapBlockObject.asObject(),
    };
  }

  getTiledMapBlockObject(): TiledMapBlockObject {
    return this.tiledMapBlockObject;
  }
}
