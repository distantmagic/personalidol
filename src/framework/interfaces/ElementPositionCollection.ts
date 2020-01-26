import Arrayable from "src/framework/interfaces/Arrayable";
import ElementBoundingBox from "src/framework/interfaces/ElementBoundingBox";
import ElementPosition from "src/framework/interfaces/ElementPosition";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface ElementPositionCollection<Unit extends ElementPositionUnit> extends Arrayable<ElementPosition<Unit>> {
  readonly unit: Unit;

  getElementBoundingBox(): ElementBoundingBox<Unit>;

  offsetCollection(elementPosition: ElementPosition<Unit>): ElementPositionCollection<Unit>;
}