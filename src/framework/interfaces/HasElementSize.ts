import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";
import { ElementSize } from "src/framework/interfaces/ElementSize";

export interface HasElementSize<T extends ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
