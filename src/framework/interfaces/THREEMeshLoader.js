// @flow

import type { Mesh } from "three";

import type { CancelToken } from "./CancelToken";
import type { QueryBus } from "./QueryBus";
import type { THREELoadingManager } from "./THREELoadingManager";

export interface THREEMeshLoader {
  load(CancelToken, source: string): Promise<Mesh>;

  getQueryBus(): QueryBus;

  getTHREELoadingManager(): THREELoadingManager;
}
