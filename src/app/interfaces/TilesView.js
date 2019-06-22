// @flow

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { TiledMap } from "../../framework/interfaces/TiledMap";
import type { TiledWorkerLoadParams } from "../../framework/types/TiledWorkerLoadParams";

export interface TilesView extends CanvasView {
  applyMap(CancelToken, TiledMap): Promise<void>;

  loadMap(CancelToken, TiledWorkerLoadParams): Promise<void>;
}
