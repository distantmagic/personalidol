// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementRotation } from "./ElementRotation";

export interface TiledMapPositionedObject {
  getElementPosition(): ElementPosition<"tile">;

  getElementRotation(): ElementRotation<"radians">;

  getName(): string;
}
