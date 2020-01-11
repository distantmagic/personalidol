import { ElementRotationUnit } from "../types/ElementRotationUnit";
import { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementRotation<Unit extends ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
