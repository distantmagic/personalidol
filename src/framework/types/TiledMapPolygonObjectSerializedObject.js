// @flow

import type { ElementPositionSerializedObject } from "./ElementPositionSerializedObject";
import type { TiledMapPositionedObjectSerializedObject } from "./TiledMapPositionedObjectSerializedObject";

export type TiledMapPolygonObjectSerializedObject = {|
  depth: number,
  polygonPoints: Array<ElementPositionSerializedObject<"tile">>,
  tiledMapPositionedObject: TiledMapPositionedObjectSerializedObject
|};
