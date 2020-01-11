import { ElementPositionUnit } from "../types/ElementPositionUnit";
import { EquatableWithPrecision } from "./EquatableWithPrecision";

export interface ElementPosition<Unit extends ElementPositionUnit> extends EquatableWithPrecision<ElementPosition<Unit>> {
  distanceTo(elementPosition: ElementPosition<Unit>): number;

  getX(): number;

  getY(): number;

  getZ(): number;

  isOnLineBetween(elementPosition1: ElementPosition<Unit>, elementPosition2: ElementPosition<Unit>): boolean;

  offset(elementPosition: ElementPosition<Unit>): ElementPosition<Unit>;
}
