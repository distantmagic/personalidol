// @flow

import type { ElementPositionSerializedObject } from "./ElementPositionSerializedObject";
import type { ElementRotationSerializedObject } from "./ElementRotationSerializedObject";

export type TiledMapPositionedObjectSerializedObject = {|
  elementPosition: ElementPositionSerializedObject<"tile">,
  elementRotation: ElementRotationSerializedObject<"radians">,
  name: string
|};
