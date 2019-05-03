// @flow

import type { ElementRotationUnit } from "./ElementRotationUnit";

export type ElementRotationSerializedObject<T: ElementRotationUnit> = {|
  x: number,
  y: number,
  z: number,
|};
