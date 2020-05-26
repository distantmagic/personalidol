import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type ElementPosition from "src/framework/interfaces/ElementPosition";

export default interface HasElementPosition<T extends ElementPositionUnit> {
  getElementPosition(): ElementPosition<T>;
}
