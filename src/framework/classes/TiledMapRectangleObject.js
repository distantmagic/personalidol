// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapBlockObject } from "../interfaces/TiledMapBlockObject";
import type { TiledMapRectangleObject as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapRectangleObject";

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

  getElementPosition(): ElementPosition<"tile"> {
    return this.tiledMapBlockObject.getElementPosition();
  }

  getElementRotation(): ElementRotation<"radians"> {
    return this.tiledMapBlockObject.getElementRotation();
  }

  getElementSize(): ElementSize<"tile"> {
    return this.tiledMapBlockObject.getElementSize();
  }

  getName(): string {
    return this.tiledMapBlockObject.getName();
  }

  getSource(): string {
    return this.tiledMapBlockObject.getSource();
  }

  hasSource(): boolean {
    return this.tiledMapBlockObject.hasSource();
  }
}
