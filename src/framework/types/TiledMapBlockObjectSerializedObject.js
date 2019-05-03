// @flow

import type { ElementPositionSerializedObject } from "./ElementPositionSerializedObject";
import type { ElementRotationSerializedObject } from "./ElementRotationSerializedObject";
import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";

export type TiledMapBlockObjectSerializedObject = {|
  elementPosition: ElementPositionSerializedObject<"tile">,
  elementRotation: ElementRotationSerializedObject<"radians">,
  elementSize: ElementSizeSerializedObject<"tile">,
  name: string,
  source: ?string,
|};
