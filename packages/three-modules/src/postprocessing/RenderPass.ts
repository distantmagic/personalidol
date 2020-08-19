import { Pass } from "./Pass";

import type { Camera } from "three/src/cameras/Camera";
import type { Color } from "three/src/math/Color";
import type { Material } from "three/src/materials/Material";
import type { Scene } from "three/src/scenes/Scene";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import type { WebGLRenderTarget } from "three/src/renderers/WebGLRenderTarget";

export class RenderPass extends Pass {
  readonly needsSwap: false = false;

  camera: Camera;
  clear: boolean = true;
  clearColor: null | Color;
  clearDepth: boolean = false;
  clearAlpha: number;
  overrideMaterial: null | Material;
  scene: Scene;

  constructor(scene: Scene, camera: Camera, overrideMaterial: null | Material = null, clearColor: null | Color = null, clearAlpha: number = 0) {
    super();

    this.scene = scene;
    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;
    this.clearAlpha = clearAlpha;
  }

  dispose(): void {}

  render(renderer: WebGLRenderer, renderToScreen: boolean, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    const oldAutoClear = renderer.autoClear;

    renderer.autoClear = false;

    let oldClearColor: null | number | Color = null;
    let oldClearAlpha;
    let oldOverrideMaterial: null | Material = null;

    const overrideMaterial = this.overrideMaterial;

    if (overrideMaterial !== null) {
      oldOverrideMaterial = this.scene.overrideMaterial;

      this.scene.overrideMaterial = overrideMaterial;
    }

    const clearColor = this.clearColor;

    if (clearColor) {
      oldClearColor = renderer.getClearColor().getHex();
      oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor(clearColor, this.clearAlpha);
    }

    if (this.clearDepth) {
      renderer.clearDepth();
    }

    renderer.setRenderTarget(renderToScreen ? null : readBuffer);

    // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
    if (this.clear) {
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }

    renderer.render(this.scene, this.camera);

    if (clearColor && null !== oldClearColor) {
      renderer.setClearColor(oldClearColor, oldClearAlpha);
    }

    if (overrideMaterial !== null) {
      this.scene.overrideMaterial = oldOverrideMaterial;
    }

    renderer.autoClear = oldAutoClear;
  }
}
