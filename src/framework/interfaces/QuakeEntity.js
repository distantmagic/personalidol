// @flow

import type { Equatable } from "./Equatable";
import type { QuakeBrush } from "./QuakeBrush";
import type { QuakeEntityProperties } from "./QuakeEntityProperties";

export interface QuakeEntity extends Equatable<QuakeEntity> {
  getBrush(): QuakeBrush;

  getProperties(): QuakeEntityProperties;

  hasBrush(): boolean;
}
