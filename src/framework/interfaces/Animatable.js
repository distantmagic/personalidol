// @flow

import * as THREE from "three";

import type { ClockTick } from "./ClockTick";

export interface Animatable {
  begin(ClockTick): void;

  draw(THREE.WebGLRenderer, ClockTick): void;

  end(THREE.WebGLRenderer, ClockTick): void;

  update(ClockTick): void;
}
