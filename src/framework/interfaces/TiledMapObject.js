// @flow

import type { Equatable } from "./Equatable";
import type { GeometryRectangle } from "./GeometryRectangle";
import type { HasElementRotation } from "./HasElementRotation";

export interface TiledMapObject
  extends Equatable<TiledMapObject>,
    GeometryRectangle<"tile">,
    HasElementRotation<"radians"> {
  getSource(): string;

  hasSource(): boolean;

  getName(): string;
}
