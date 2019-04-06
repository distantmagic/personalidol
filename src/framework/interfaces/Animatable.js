// @flow

import * as THREE from "three";

import type { ClockTick } from "./ClockTick";

export interface Animatable {
  begin(): void;

  draw(THREE.WebGLRenderer, interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;

  update(delta: number): void;
}
