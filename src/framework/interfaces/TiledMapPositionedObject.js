// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementRotation } from "./ElementRotation";
import type { Equatable } from "./Equatable";

export interface TiledMapPositionedObject extends Equatable<TiledMapPositionedObject> {
  getElementPosition(): ElementPosition<"tile">;

  getElementRotation(): ElementRotation<"radians">;

  getName(): string;
}
