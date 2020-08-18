import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

import type { Pass as IPass } from "./Pass.interface";

export abstract class Pass implements IPass {
  enabled: boolean = true;
  needsSwap: boolean = true;
  clear: boolean = false;
  renderToScreen: boolean = false;

  abstract render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;

  setSize(width: number, height: number): void {}
}
