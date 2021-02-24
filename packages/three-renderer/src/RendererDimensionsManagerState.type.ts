import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { ResizeableRenderer } from "@personalidol/three-modules/src/ResizeableRenderer.interface";

export type RendererDimensionsManagerState = MainLoopUpdatableState & {
  renderers: Set<ResizeableRenderer>;
  renderersNeedingUpdate: Set<ResizeableRenderer>;
};
