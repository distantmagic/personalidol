import { Arrayable } from "./Arrayable";
import { ElementBoundingBox } from "./ElementBoundingBox";
import { ElementPosition } from "./ElementPosition";
import { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface ElementPositionCollection<Unit extends ElementPositionUnit> extends Arrayable<ElementPosition<Unit>> {
  getElementBoundingBox(): ElementBoundingBox<Unit>;

  offsetCollection(elementPosition: ElementPosition<Unit>): ElementPositionCollection<Unit>;
}
