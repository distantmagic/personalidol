// @flow

import type { FPSAdaptive as FPSAdaptiveInterface } from "../interfaces/FPSAdaptive";

export default class FPSAdaptive implements FPSAdaptiveInterface {
  setActualFPS(fps: number): void {}

  setExpectedFPS(fps: number): void {}
}
