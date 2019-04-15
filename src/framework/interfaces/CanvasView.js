// @flow

import type { WebGLRenderer } from "three";

import type { Animatable } from "./Animatable";

export interface CanvasView extends Animatable {
  attach(WebGLRenderer): Promise<void>;

  start(): Promise<void>;

  detach(WebGLRenderer): Promise<void>;

  stop(): Promise<void>;
}
