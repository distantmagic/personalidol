// @flow

import * as THREE from "three";

import type { ClockTick } from "./ClockTick";

export interface Animatable {
  begin(): void;

  draw(THREE.WebGLRenderer): void;

  end(THREE.WebGLRenderer): void;

  update(): void;
}
