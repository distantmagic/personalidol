import { MathUtils } from "three/src/math/MathUtils";

import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";

import type { ResizeableRenderer } from "@personalidol/three-modules/src/ResizeableRenderer.interface";

import type { RendererDimensionsManager as IRendererDimensionsManager } from "./RendererDimensionsManager.interface";
import type { RendererDimensionsManagerState } from "./RendererDimensionsManagerState.type";

export function RendererDimensionsManager(dimensionsState: Uint32Array): IRendererDimensionsManager {
  const state: RendererDimensionsManagerState = Object.seal({
    renderers: new Set(),
    renderersNeedingUpdate: new Set(),
  });

  let _isStarted: boolean = false;
  let _dimensionsLastUpdate: number = -1;
  let _renderersLastUpdate: number = 0;

  function _updateRendererDimensions(renderer: ResizeableRenderer) {
    renderer.setSize(dimensionsState[DimensionsIndices.D_WIDTH], dimensionsState[DimensionsIndices.D_HEIGHT]);
  }

  function start(): void {
    if (_isStarted) {
      throw new Error("RendererDimensionsManager is already started.");
    }

    _isStarted = true;
  }

  function stop(): void {
    if (!_isStarted) {
      throw new Error("RendererDimensionsManager is already stopped.");
    }

    _isStarted = false;
  }

  function update(delta: number): void {
    if (!_isStarted) {
      return;
    }

    _dimensionsLastUpdate = dimensionsState[DimensionsIndices.LAST_UPDATE];

    if (_dimensionsLastUpdate > _renderersLastUpdate) {
      state.renderers.forEach(_updateRendererDimensions);
      _renderersLastUpdate = dimensionsState[DimensionsIndices.LAST_UPDATE];
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "RendererDimensionsManager",
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
