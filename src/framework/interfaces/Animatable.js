// @flow

import * as THREE from "three";

import type { ClockTick } from "./ClockTick";

export interface Animatable {
  begin(ClockTick): Promise<void>;

  draw(THREE.WebGLRenderer, ClockTick): Promise<void>;

  end(THREE.WebGLRenderer, ClockTick): Promise<void>;

  update(ClockTick): Promise<void>;
}
