// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapBlockObject extends TiledMapPositionedObject {
  getElementSize(): ElementSize<"tile">;

  getSource(): string;

  hasSource(): boolean;
}
