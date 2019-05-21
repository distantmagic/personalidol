// @flow

import type { ElementPositionUnit } from "./ElementPositionUnit";

export type ElementSizeSerializedObject<T: ElementPositionUnit> = {|
  depth: number,
  height: number,
  width: number,
|};
