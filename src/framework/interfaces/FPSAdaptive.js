// @flow

import type { FPSController } from "./FPSController";

export interface FPSAdaptive extends FPSController {
  setActualFPS(number): void;
}
