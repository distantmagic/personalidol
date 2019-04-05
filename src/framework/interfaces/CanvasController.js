// @flow

import * as THREE from "three";

import type { Animatable } from "./Animatable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends Animatable, Resizeable {
  attach(THREE.WebGLRenderer): Promise<void>;

  detach(THREE.WebGLRenderer): Promise<void>;
}
