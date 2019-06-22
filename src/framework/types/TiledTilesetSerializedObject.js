// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledTileSerializedObject } from "./TiledTileSerializedObject";

export type TiledTilesetSerializedObject = {|
  expectedTileCount: number,
  firstgid: number,
  tiles: $ReadOnlyArray<TiledTileSerializedObject>,
  tileSize: ElementSizeSerializedObject<"px">,
|};
