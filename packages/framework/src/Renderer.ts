import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { GlitchPass } from "@personalidol/three-modules/src/postprocessing/GlitchPass";

import { Dimensions } from "./Dimensions";
import { updateCameraAspect } from "./updateCameraAspect";

import type { Renderer as IRenderer } from "./Renderer.interface";

import type { RendererState } from "./RendererState.type";

const _DIMENSIONS_LAST_UPDATE = Symbol("_DIMENSIONS_LAST_UPDATE");

export function Renderer(state: RendererState, dimensionsState: Uint32Array): IRenderer {
  let _isStarted: boolean = false;
  let _lastDimensionsUpdate: number = 0;

  console.log(EffectComposer);
  console.log(RenderPass);
  console.log(GlitchPass);

  function start(): void {
    if (_isStarted) {
      throw new Error("Renderer is already started.");
    }

    _isStarted = true;
  }

  function stop(): void {
    if (!_isStarted) {
      throw new Error("Renderer is already stopped.");
    }

    _isStarted = false;
  }

  function update(): void {
    if (!_isStarted) {
      return;
    }

    const { camera, renderer, scene } = state;

    if (!renderer) {
      return;
    }

    if ((scene && !camera) || (!scene && camera)) {
      throw new Error("Renderer is set, but scene and camera is not set. Try either setting both (camera and scene) or none of them.");
    }

    if (!scene || !camera) {
      return;
    }

    const dimensionsLastUpdate = dimensionsState[Dimensions.code.LAST_UPDATE];
    const cameraUserData: any = camera.userData as any;

    if (!cameraUserData.hasOwnProperty(_DIMENSIONS_LAST_UPDATE) || dimensionsLastUpdate > cameraUserData[_DIMENSIONS_LAST_UPDATE]) {
      updateCameraAspect(camera, dimensionsState);
      cameraUserData[_DIMENSIONS_LAST_UPDATE] = dimensionsLastUpdate;
    }

    if (dimensionsLastUpdate > _lastDimensionsUpdate) {
      renderer.setSize(dimensionsState[Dimensions.code.D_WIDTH], dimensionsState[Dimensions.code.D_HEIGHT]);
      _lastDimensionsUpdate = dimensionsState[Dimensions.code.LAST_UPDATE];
    }

    renderer.render(scene, camera);
  }

  return Object.freeze({
    name: "Renderer",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
