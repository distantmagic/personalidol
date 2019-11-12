// @flow

import type { QuakeBrush } from "./QuakeBrush";
import type { QuakeEntityProperties } from "./QuakeEntityProperties";

export interface QuakeEntity {
  getBrush(): QuakeBrush;

  getProperties(): QuakeEntityProperties;

  hasBrush(): boolean;
}
