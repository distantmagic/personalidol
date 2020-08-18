import { Pass } from "./Pass";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

export class ClearMaskPass extends Pass {
  constructor() {
    super();

    this.needsSwap = false;
  }

  render(renderer: WebGLRenderer) {
    renderer.state.buffers.stencil.setLocked(false);
    renderer.state.buffers.stencil.setTest(false);
  }
}
