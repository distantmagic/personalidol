// @flow

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { TiledMapSerializedObject } from "../../framework/types/TiledMapSerializedObject";
import type { TiledWorkerLoadParams } from "../types/TiledWorkerLoadParams";

export interface TiledWorker {
  load(CancelToken, TiledWorkerLoadParams): Promise<TiledMapSerializedObject>;
}
