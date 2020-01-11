import { ElementPosition } from "./ElementPosition";
import { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface HasElementPosition<T extends ElementPositionUnit> {
  getElementPosition(): ElementPosition<T>;
}
