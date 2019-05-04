// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledTileSerializedObject } from "./TiledTileSerializedObject";

export type TiledTilesetSerializedObject = {|
  expectedTileCount: number,
  tiles: Array<TiledTileSerializedObject>,
  tileSize: ElementSizeSerializedObject<"px">
|};
