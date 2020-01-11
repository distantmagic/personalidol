import { ElementSize } from "./ElementSize";
import { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface Resizeable<Unit extends ElementPositionUnit> {
  resize(elementSize: ElementSize<Unit>): void;
}
