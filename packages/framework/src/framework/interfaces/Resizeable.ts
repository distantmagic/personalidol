import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type ElementSize from "src/framework/interfaces/ElementSize";

export default interface Resizeable<Unit extends ElementPositionUnit> {
  resize(elementSize: ElementSize<Unit>): void;
}
