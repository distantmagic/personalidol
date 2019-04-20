// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapObject } from "./TiledMapObject";

export interface TiledMapRectangleObject extends TiledMapObject {
  // isEllipse: false;
  // isPolygon: false;
  isRectangle: true;

  getElementSize(): ElementSize<"tile">;
}
