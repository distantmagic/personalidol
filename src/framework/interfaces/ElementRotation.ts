import { ElementRotationUnit } from "src/framework/types/ElementRotationUnit";
import { EquatableWithPrecision } from "src/framework/interfaces/EquatableWithPrecision";

export interface ElementRotation<Unit extends ElementRotationUnit> extends EquatableWithPrecision<ElementRotation<Unit>> {
  getRotationX(): number;

  getRotationY(): number;

  getRotationZ(): number;
}
