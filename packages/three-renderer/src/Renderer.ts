import { Dimensions } from "@personalidol/framework/src/Dimensions";

import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";

import type { Renderer as IRenderer } from "./Renderer.interface";

export function Renderer(dimensionsState: Uint32Array, effectComposer: EffectComposer, webGLRenderer: WebGLRenderer): IRenderer {
  let _isStarted: boolean = false;
  let _lastDimensionsUpdate: number = 0;

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

  function update(delta: number): void {
    if (!_isStarted) {
      return;
    }

    const dimensionsLastUpdate = dimensionsState[Dimensions.code.LAST_UPDATE];

    if (dimensionsLastUpdate > _lastDimensionsUpdate) {
      webGLRenderer.setSize(dimensionsState[Dimensions.code.D_WIDTH], dimensionsState[Dimensions.code.D_HEIGHT]);
      effectComposer.setSize(dimensionsState[Dimensions.code.D_WIDTH], dimensionsState[Dimensions.code.D_HEIGHT]);
      _lastDimensionsUpdate = dimensionsState[Dimensions.code.LAST_UPDATE];
    }
  }

  return Object.freeze({
    name: "Renderer",

    start: start,
    stop: stop,
    update: update,
  });
}
