import type { Pass } from "three/examples/jsm/postprocessing/Pass";
import type { WebGLRenderer, WebGLRenderTarget } from "three";

declare module "three/examples/jsm/postprocessing/EffectComposer" {
  declare export interface EffectComposer {
    // An array representing the (ordered) chain of post-processing passes.
    passes: $ReadOnlyArray<Pass>;
    // A reference to the internal read buffer. Passes usually read the previous render result from this buffer.
    readBuffer: WebGLRendererTarget;
    // A reference to the internal renderer.
    renderer: WebGLRenderer;
    // Whether the final pass is rendered to the screen (default framebuffer) or not.
    renderToScreen: boolean;
    // A reference to the internal write buffer. Passes usually write their result into this buffer.
    writeBuffer: WebGLRendererTarget;

    constructor(WebGLRenderer, ?WebGLRendererTarget): void;

    addPass(pass: Pass): void;

    setSize(width: number, height: number): void;

    render(): void;
  }
}
