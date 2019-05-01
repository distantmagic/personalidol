// @flow

import type { Vector3 } from "three";

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";

export interface ElementPosition<Unit: ElementPositionUnit>
  extends Equatable<ElementPosition<Unit>>,
    Vector3 {
  getX(): number;

  getY(): number;

  getZ(): number;
}
