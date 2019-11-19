// @flow

import type { Vector3 } from "three";

import type { Equatable } from "./Equatable";
import type { QuakeBrush } from "./QuakeBrush";
import type { QuakeEntityProperties } from "./QuakeEntityProperties";

export interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrushes(): $ReadOnlyArray<QuakeBrush>;

  getOrigin(): Vector3;

  getProperties(): QuakeEntityProperties;

  hasOrigin(): boolean;

  isOfClass(string): boolean;
}
