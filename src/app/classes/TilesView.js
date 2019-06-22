// @flow

import * as THREE from "three";

import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import Exception from "../../framework/classes/Exception";
import TiledMapUnserializer from "../../framework/classes/TiledMapUnserializer";
import TiledWorker from "../../framework/classes/TiledWorker.worker";
import WorkerClientController from "../../framework/classes/WorkerClientController";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { TiledMap } from "../../framework/interfaces/TiledMap";
import type { TiledMapSerializedObject } from "../../framework/types/TiledMapSerializedObject";
import type { TiledWorker as TiledWorkerInterface } from "../../framework/interfaces/TiledWorker";
import type { TiledWorkerLoadParams } from "../../framework/types/TiledWorkerLoadParams";
import type { TilesView as TilesViewInterface } from "../interfaces/TilesView";
import type { WorkerClientController as WorkerClientControllerInterface } from "../../framework/interfaces/WorkerClientController";

export default class TilesView implements TilesViewInterface {
  +canvasViewGroup: CanvasViewGroupInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +threeLoadingManager: THREELoadingManager;
  tiledWorker: ?Worker;
  tiledWorkerController: ?WorkerClientControllerInterface<TiledWorkerInterface>;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager
  ) {
    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs.add("CanvasViewGroup"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.threeLoadingManager = threeLoadingManager;
    this.tiledWorker = null;
    this.tiledWorkerController = null;
  }

  async applyMap(cancelToken: CancelToken, tiledMap: TiledMap): Promise<void> {
    for await (let tiledMapSkinnedLayer of tiledMap.generateSkinnedLayers(cancelToken)) {
      for await (let tiledSkinnedTile of tiledMapSkinnedLayer.generateSkinnedTiles(cancelToken)) {
        // console.log(tiledSkinnedTile);
      }
    }
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    this.tiledWorker = new TiledWorker();
    this.tiledWorkerController = new WorkerClientController<TiledWorkerInterface>(this.tiledWorker);

    await this.canvasViewGroup.attach(cancelToken, renderer);
  }

  begin(): void {
    return this.canvasViewGroup.begin();
  }

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.detach(cancelToken, renderer);
  }

  async loadMap(cancelToken: CancelToken, params: TiledWorkerLoadParams): Promise<void> {
    const tiledWorkerController = this.tiledWorkerController;

    if (!tiledWorkerController) {
      throw new Exception(
        this.loggerBreadcrumbs.add("loadMap"),
        "Worker controller is not set but it was expected. This method can be called only after attaching the view."
      );
    }

    const tiledMapSerializedObject = await tiledWorkerController.request<
      TiledWorkerLoadParams,
      TiledMapSerializedObject
    >(cancelToken, "loadMap", params);
    const tiledMapUnserializer = new TiledMapUnserializer(this.loggerBreadcrumbs);
    const tiledMap = await tiledMapUnserializer.fromObject(tiledMapSerializedObject);

    await this.applyMap(cancelToken, tiledMap);
  }

  async start(): Promise<void> {
    await this.canvasViewGroup.start();
  }

  async stop(): Promise<void> {
    await this.canvasViewGroup.stop();
  }

  update(delta: number): void {
    this.canvasViewGroup.update(delta);
  }
}
