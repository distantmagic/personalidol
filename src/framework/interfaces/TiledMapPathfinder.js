// @flow

import type { ElementPosition } from "./ElementPosition";

export interface TiledMapPathfinder {
  findPath(
    start: ElementPosition<"tile">,
    end: ElementPosition<"tile">
  ): Promise<$ReadOnlyArray<ElementPosition<"tile">>>;
}
