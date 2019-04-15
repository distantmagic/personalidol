// @flow

import type { FPSAdaptive as FPSAdaptiveInterface } from "../interfaces/FPSAdaptive";

export default class FPSAdaptive implements FPSAdaptiveInterface {
  actualFPS: number;
  adjustedFPS: number;
  expectedFPS: number;

  constructor() {
    this.expectedFPS = 60;
    this.actualFPS = this.expectedFPS;
    this.adjustedFPS = this.expectedFPS;
  }

  setActualFPS(fps: number): void {
    this.actualFPS = fps;
  }

  setExpectedFPS(fps: number): void {
    this.expectedFPS = fps;
  }
}
