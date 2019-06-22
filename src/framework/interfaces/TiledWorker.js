// @flow

import type { CancelToken } from "./CancelToken";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledWorkerLoadParams } from "../types/TiledWorkerLoadParams";

export interface TiledWorker {
  loadMap(CancelToken, TiledWorkerLoadParams): Promise<TiledMapSerializedObject>;
}
