import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

export abstract class Pass {
  // if set to true, the pass is processed by the composer
  enabled: boolean = true;

  // if set to true, the pass indicates to swap read and write buffer after rendering
  needsSwap: boolean = true;

  // if set to true, the pass clears its buffer before rendering
  clear: boolean = false;

  // if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
  renderToScreen: boolean = false;

  abstract render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;

  setSize(width: number, height: number): void {}
}
