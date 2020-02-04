import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import ElementPosition from "src/framework/interfaces/ElementPosition";

export default interface Positionable<Unit extends ElementPositionUnit> {
  setPosition(elementPosition: ElementPosition<Unit>): void;
}
