// @flow

import type { ElementPositionSerializedObject } from "./ElementPositionSerializedObject";
import type { TiledMapPositionedObjectSerializedObject } from "./TiledMapPositionedObjectSerializedObject";

export type TiledMapPolygonObjectSerializedObject = {|
  depth: number,
  polygonPoints: $ReadOnlyArray<ElementPositionSerializedObject<"tile">>,
  tiledMapPositionedObject: TiledMapPositionedObjectSerializedObject,
|};
