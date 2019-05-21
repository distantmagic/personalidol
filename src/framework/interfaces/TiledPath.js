// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { Equatable } from "./Equatable";

export interface TiledPath<T: ElementPositionUnit> extends Equatable<TiledPath<T>> {
  addStep(ElementPosition<T>): void;

  getSteps(): $ReadOnlyArray<ElementPosition<T>>;
}
