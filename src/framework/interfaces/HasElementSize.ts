import ElementSize from "src/framework/interfaces/ElementSize";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface HasElementSize<T extends ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
