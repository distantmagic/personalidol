// @flow

import type { FPSAdaptive as FPSAdaptiveInterface } from "../interfaces/FPSAdaptive";
import type { MainLoop } from "../interfaces/MainLoop";

export default class FPSAdaptive implements FPSAdaptiveInterface {
  +mainLoop: MainLoop;
  actualFPS: number;
  adjustedFPS: number;
  expectedFPS: number;

  constructor(mainLoop: MainLoop) {
    this.expectedFPS = 60;
    this.actualFPS = this.expectedFPS;
    this.adjustedFPS = this.expectedFPS;
    this.mainLoop = mainLoop;
  }

  setActualFPS(fps: number): void {
    this.actualFPS = fps;
  }

  setExpectedFPS(fps: number): void {
    this.expectedFPS = fps;
    this.mainLoop.setMaxAllowedFPS(fps);
  }
}
