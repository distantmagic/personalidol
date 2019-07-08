// @flow

import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { Equatable } from "./Equatable";

export interface ElementRotation<Unit: ElementRotationUnit> extends Equatable<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
