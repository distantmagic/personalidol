// @flow

import type { Arrayable } from "./Arrayable";
import type { ElementBoundingBox } from "./ElementBoundingBox";
import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";

export interface ElementPositionCollection<Unit: ElementPositionUnit> extends Arrayable<ElementPosition<Unit>> {
  getElementBoundingBox(): ElementBoundingBox<Unit>;

  offsetCollection(ElementPosition<Unit>): ElementPositionCollection<Unit>;
}
