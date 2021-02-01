import type { RenderTarget } from "three/src/renderers/webgl/WebGLRenderLists";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

type SupportedRenederTargets = RenderTarget | WebGLRenderTarget;

function isWebGLRenderTarget(renderTarget: SupportedRenederTargets): renderTarget is WebGLRenderTarget {
  return true === (renderTarget as WebGLRenderTarget).isWebGLRenderTarget;
}

export function disposeWebGLRenderTarget(renderTarget: null | SupportedRenederTargets): void {
  if (null === renderTarget) {
    return;
  }

  if (isWebGLRenderTarget(renderTarget)) {
    renderTarget.dispose();

    return;
  }

  throw new Error("Unsupported render target can't be disposed.");
}
