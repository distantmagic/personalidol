import type { WebGLRenderer } from "three";

declare module "three/examples/jsm/postprocessing/Pass" {
  declare export interface Pass {
    // if set to true, the pass clears its buffer before rendering
    clear: boolean;

    // if set to true, the pass is processed by the composer
    enabled: boolean;

    // if set to true, the pass indicates to swap read and write buffer after
    // rendering
    needsSwap: boolean;

    // if set to true, the result of the pass is rendered to screen. This is
    // set automatically by EffectComposer.
    renderToScreen: boolean;

    setSize(width: number, height: number): void;

    render(WebGLRenderer /*, writeBuffer, readBuffer, deltaTime, maskActive */): void;
  }
}
