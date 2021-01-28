import type { DisposableGeneric } from "@personalidol/framework/src/DisposableGeneric.interface";

import type { Pass } from "./Pass.interface";
import type { ResizeableRenderer } from "../ResizeableRenderer.interface";

export interface EffectComposer extends DisposableGeneric, ResizeableRenderer {
  addPass(pass: Pass): void;

  isLastEnabledPass(passIndex: number): boolean;

  removePass(pass: Pass): void;

  render(deltaTime: number): void;

  setPixelRatio(pixelRatio: number): void;

  swapBuffers(): void;
}
