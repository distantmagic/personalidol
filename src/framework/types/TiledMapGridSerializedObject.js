// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledMapGridArray } from "./TiledMapGridArray";

export type TiledMapGridSerializedObject = {|
  grid: TiledMapGridArray,
  gridSize: ElementSizeSerializedObject<"tile">
|};
