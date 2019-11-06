// @flow

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import THREEFBXMesh from "./Query/THREEFBXMesh";

import type { Mesh } from "three";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../interfaces/QueryBus";
import type { THREELoadingManager } from "../interfaces/THREELoadingManager";
import type { THREEMeshLoader as THREEMeshLoaderInterface } from "../interfaces/THREEMeshLoader";

export default class THREEMeshLoader implements THREEMeshLoaderInterface {
  +fbxLoader: FBXLoader;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +threeLoadingManager: THREELoadingManager;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, queryBus: QueryBus, threeLoadingManager: THREELoadingManager) {
    this.fbxLoader = new FBXLoader(threeLoadingManager.getLoadingManager());
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.threeLoadingManager = threeLoadingManager;
  }

  getQueryBus(): QueryBus {
    return this.queryBus;
  }

  getTHREELoadingManager(): THREELoadingManager {
    return this.threeLoadingManager;
  }

  load(cancelToken: CancelToken, source: string): Promise<Mesh> {
    const query = new THREEFBXMesh(this.fbxLoader, source);

    return this.queryBus.enqueue(cancelToken, query);
  }
}
