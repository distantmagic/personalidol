// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledCustomPropertiesSerializedObject } from "./TiledCustomPropertiesSerializedObject";
import type { TiledMapGridSerializedObject } from "./TiledMapGridSerializedObject";

export type TiledMapLayerSerializedObject = {|
  layerSize: ElementSizeSerializedObject<"tile">,
  name: string,
  tiledCustomProperties: TiledCustomPropertiesSerializedObject,
  tiledMapGrid: TiledMapGridSerializedObject,
|};
