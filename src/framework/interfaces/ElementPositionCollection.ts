import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type Arrayable from "src/framework/interfaces/Arrayable";
import type ElementBoundingBox from "src/framework/interfaces/ElementBoundingBox";
import type ElementPosition from "src/framework/interfaces/ElementPosition";

export default interface ElementPositionCollection<Unit extends ElementPositionUnit> extends Arrayable<ElementPosition<Unit>> {
  readonly unit: Unit;

  getElementBoundingBox(): ElementBoundingBox<Unit>;

  offsetCollection(elementPosition: ElementPosition<Unit>): ElementPositionCollection<Unit>;
}
