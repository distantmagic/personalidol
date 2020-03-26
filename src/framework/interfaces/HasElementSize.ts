import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type ElementSize from "src/framework/interfaces/ElementSize";

export default interface HasElementSize<T extends ElementPositionUnit> {
  getElementSize(): ElementSize<T>;
}
