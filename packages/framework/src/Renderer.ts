import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";

import { Dimensions } from "./Dimensions";
import { updateCameraAspect } from "./updateCameraAspect";

import type { Renderer as IRenderer } from "./Renderer.interface";

import type { RendererState } from "./RendererState.type";

export function Renderer(state: RendererState, dimensionsState: Uint16Array): IRenderer {
  let _isStarted = false;

  console.log(EffectComposer);

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

    if (camera) {
      updateCameraAspect(camera, dimensionsState);
    }

    if (!scene || !camera) {
      return;
    }

    renderer.setSize(dimensionsState[Dimensions.code.D_WIDTH], dimensionsState[Dimensions.code.D_HEIGHT]);
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
