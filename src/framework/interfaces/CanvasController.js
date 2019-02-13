// @flow

import * as THREE from "three";

import type { ClockTick } from "../../framework/interfaces/ClockTick";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends Resizeable {
  tick(THREE.WebGLRenderer, ClockTick): Promise<void>;
}
