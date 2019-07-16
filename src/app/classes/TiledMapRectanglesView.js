// @flow

import * as THREE from "three";
import THREEMeshLoader from "../../framework/classes/THREEMeshLoader";

import type { Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { THREEMeshLoader as THREEMeshLoaderInterface } from "../../framework/interfaces/THREEMeshLoader";
import type { TiledMap } from "../../framework/interfaces/TiledMap";

export default class TiledMapRectanglesView implements CanvasView {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +threeMeshLoader: THREEMeshLoaderInterface;
  +threeLoadingManager: THREELoadingManager;
  +tiledMap: TiledMap;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    tiledMap: TiledMap
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.threeMeshLoader = new THREEMeshLoader(loggerBreadcrumbs.add("THREEMeshLoader"), queryBus, threeLoadingManager);
    this.tiledMap = tiledMap;
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  begin(): void {}

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {}
}
