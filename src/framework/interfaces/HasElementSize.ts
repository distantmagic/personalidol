import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import ElementSize from "src/framework/interfaces/ElementSize";

export default interface HasElementSize<T extends ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
