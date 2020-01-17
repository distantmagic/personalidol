import ElementPosition from "src/framework/interfaces/ElementPosition";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface HasElementPosition<T extends ElementPositionUnit> {
  getElementPosition(): ElementPosition<T>;
}
