// @flow

import type { Camera, Raycaster, Scene, WebGLRenderer } from "three";

import type { Animatable } from "./Animatable";
import type { Observer } from "./Observer";
import type { Resizeable } from "./Resizeable";

export interface THREEPointerInteraction extends Animatable, Observer, Resizeable<"px"> {
  constructor(WebGLRenderer, Camera): void;

  getCameraRaycaster(): Raycaster;
}
