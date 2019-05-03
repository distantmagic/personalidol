// @flow

import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";

export type TiledMapLayerSerializedObject = {|
  layerSize: ElementSizeSerializedObject<"tile">,
  name: string,
  tiledMapGrid: TiledMapGridSerializedObject
|};
