import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import ElementSize from "src/framework/interfaces/ElementSize";

export default interface Resizeable<Unit extends ElementPositionUnit> {
  resize(elementSize: ElementSize<Unit>): void;
}
