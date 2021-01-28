import type { ResizeableRenderer } from "@personalidol/three-modules/src/ResizeableRenderer.interface";

export type RendererDimensionsManagerState = {
  renderers: Set<ResizeableRenderer>;
  renderersNeedingUpdate: Set<ResizeableRenderer>;
};
