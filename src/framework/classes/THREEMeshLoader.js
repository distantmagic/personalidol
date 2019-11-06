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
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +threeLoadingManager: THREELoadingManager;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, queryBus: QueryBus, threeLoadingManager: THREELoadingManager) {
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

  load(cancelToken: CancelToken, source: string, resourcesPath: string): Promise<Mesh> {
    const fbxLoader = new FBXLoader(this.threeLoadingManager.getLoadingManager());
    const query = new THREEFBXMesh(fbxLoader, source);

    fbxLoader.setResourcePath(resourcesPath);

    return this.queryBus.enqueue(cancelToken, query);
  }
}
