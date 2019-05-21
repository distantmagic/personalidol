// @flow

import type { ElementPositionSerializedObject } from "./ElementPositionSerializedObject";
import type { ElementRotationSerializedObject } from "./ElementRotationSerializedObject";
import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledMapPositionedObjectSerializedObject } from "./TiledMapPositionedObjectSerializedObject";

export type TiledMapBlockObjectSerializedObject = {|
  elementSize: ElementSizeSerializedObject<"tile">,
  source: ?string,
  tiledMapPositionedObject: TiledMapPositionedObjectSerializedObject,
|};
