// @flow

import type { WebGLRenderer } from "three";

import type { Animatable } from "./Animatable";
import type { CancelToken } from "./CancelToken";

export interface CanvasView extends Animatable {
  attach(CancelToken, WebGLRenderer): Promise<void>;

  start(): Promise<void>;

  detach(CancelToken, WebGLRenderer): Promise<void>;

  stop(): Promise<void>;
}
