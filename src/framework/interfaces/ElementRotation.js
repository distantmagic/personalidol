// @flow

import type { Equatable } from "./Equatable";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";

export interface ElementRotation<Unit: ElementRotationUnit>
  extends Equatable<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
