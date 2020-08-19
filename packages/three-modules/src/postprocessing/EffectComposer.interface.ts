import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

import type { Pass } from "./Pass.interface";

export interface EffectComposer {
  addPass(pass: Pass): void;

  insertPass(pass: Pass, index: number): void;

  isLastEnabledPass(passIndex: number): boolean;

  removePass(pass: Pass): void;

  render(deltaTime: number): void;

  reset(renderTarget: null | WebGLRenderTarget): void;

  setPixelRatio(pixelRatio: number): void;

  setSize(width: number, height: number): void;

  swapBuffers(): void;
}
