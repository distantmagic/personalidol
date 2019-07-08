// @flow

import type { ElementRotation } from "./ElementRotation";
import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledMapPositionedObject } from "./TiledMapPositionedObject";

export interface TiledMapBlockObject extends Equatable<TiledMapBlockObject> {
  getElementSize(): ElementSize<"tile">;

  getSource(): string;

  getTiledMapPositionedObject(): TiledMapPositionedObject;

  hasSource(): boolean;
}
