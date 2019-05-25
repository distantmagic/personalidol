// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { ElementRotation } from "./ElementRotation";
import type { ElementRotationUnit } from "../types/ElementRotationUnit";
import type { Equatable } from "./Equatable";

export interface TiledPath<T: ElementPositionUnit> extends Equatable<TiledPath<T>> {
  addStep(ElementPosition<T>): void;

  getClosestStep(ElementPosition<T>): ElementPosition<T>;

  getClosestStepIndex(ElementPosition<T>): number;

  getClosestNextStep(ElementPosition<T>): ElementPosition<T>;

  getClosestPreviousStep(ElementPosition<T>): ElementPosition<T>;

  getDistanceAtElementPosition(ElementPosition<T>): number;

  getElementPositionAtDistance(distance: number): ElementPosition<T>;

  getElementRotationAtDistance(distance: number): ElementRotation<"radians">;

  getLength(): number;

  getSteps(): $ReadOnlyArray<ElementPosition<T>>;

  hasStep(ElementPosition<T>): boolean;

  hasStepExact(ElementPosition<T>): boolean;
}
