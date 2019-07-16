// @flow

import type { Equatable } from "./Equatable";
import type { HasElementPosition } from "./HasElementPosition";
import type { HasElementRotation } from "./HasElementRotation";
import type { HasElementSize } from "./HasElementSize";

export interface TiledMapObject
  extends Equatable<TiledMapObject>,
    HasElementPosition<"tile">,
    HasElementRotation<"radians">,
    HasElementSize<"tile"> {
  getSource(): string;

  hasSource(): boolean;

  getName(): string;
}
