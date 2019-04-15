// @flow

import type { WebGLRenderer } from "three";

export interface Renderable {
  draw(WebGLRenderer, interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;
}
