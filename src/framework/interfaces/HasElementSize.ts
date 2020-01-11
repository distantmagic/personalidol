import { ElementPositionUnit } from "../types/ElementPositionUnit";
import { ElementSize } from "./ElementSize";

export interface HasElementSize<T extends ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
