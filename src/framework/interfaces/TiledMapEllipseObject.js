// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapObject } from "./TiledMapObject";

export interface TiledMapEllipseObject extends TiledMapObject {
  isEllipse: true;
  // isPolygon: false;
  // isRectangel: false;

  getElementSize(): ElementSize<"tile">;
}
