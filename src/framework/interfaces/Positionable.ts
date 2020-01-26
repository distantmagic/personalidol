import ElementPosition from "src/framework/interfaces/ElementPosition";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface Positionable<Unit extends ElementPositionUnit> {
  setPosition(elementPosition: ElementPosition<Unit>): void;
}
