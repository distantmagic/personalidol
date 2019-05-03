// @flow

import type { ElementPositionUnit } from "./ElementPositionUnit";

export type ElementPositionSerializedObject<T: ElementPositionUnit> = {|
  x: number,
  y: number,
  z: number
|};
