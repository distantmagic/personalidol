// @flow

import type { ElementPosition } from "./ElementPosition";
import type { TiledPath } from "./TiledPath";

export interface TiledPathfinder {
  findPath(start: ElementPosition<"tile">, end: ElementPosition<"tile">): Promise<TiledPath<"tile">>;
}
