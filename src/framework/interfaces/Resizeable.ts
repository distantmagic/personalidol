import ElementSize from "src/framework/interfaces/ElementSize";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface Resizeable<Unit extends ElementPositionUnit> {
  resize(elementSize: ElementSize<Unit>): void;
}
