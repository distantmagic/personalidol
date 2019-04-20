// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementRotation } from "./ElementRotation";
import type { ElementSize } from "./ElementSize";

export interface TiledMapObject {
  getElementPosition(): ElementPosition<"tile">;

  getElementRotation(): ElementRotation<"radians">;

  getElementSize(): ElementSize<"tile">;

  getName(): string;
}
