// @flow

import * as THREE from "three";

import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import THREETilesetMaterials from "../../framework/classes/THREETilesetMaterials";
import THREETilesetMeshes from "../../framework/classes/THREETilesetMeshes";
import TiledMapLoader from "../../framework/classes/TiledMapLoader";
import TiledTilesetLoader from "../../framework/classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../../framework/classes/URLTextContentQueryBuilder";

import type { Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
// import type { TiledMap } from "../../framework/interfaces/TiledMap";
import type { TiledMapLoader as TiledMapLoaderInterface } from "../../framework/interfaces/TiledMapLoader";
import type { TiledWorkerLoadParams } from "../../framework/types/TiledWorkerLoadParams";
import type { TilesView as TilesViewInterface } from "../interfaces/TilesView";

export default class TilesView implements TilesViewInterface {
  +canvasViewGroup: CanvasViewGroupInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  +tiledMapLoader: TiledMapLoaderInterface;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager
  ) {
    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs.add("CanvasViewGroup"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;

    const tiledQueryBuilder = new URLTextContentQueryBuilder();

    this.tiledMapLoader = new TiledMapLoader(
      loggerBreadcrumbs,
      queryBus,
      tiledQueryBuilder,
      new TiledTilesetLoader(loggerBreadcrumbs, queryBus, tiledQueryBuilder)
    );
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.attach(cancelToken, renderer);
  }

  begin(): void {
    return this.canvasViewGroup.begin();
  }

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.detach(cancelToken, renderer);
  }

  async loadMap(cancelToken: CancelToken, params: TiledWorkerLoadParams): Promise<void> {
    const tiledMap = await this.tiledMapLoader.load(cancelToken, params.filename);
    const tilesetMaterials = new THREETilesetMaterials(
      this.loggerBreadcrumbs.add("THREETilesetMaterials"),
      this.threeLoadingManager
    );
    const tilesetMeshes = new THREETilesetMeshes(this.loggerBreadcrumbs.add("THREETilesetMeshes"), tilesetMaterials);

    for await (let tiledMapSkinnedLayer of tiledMap.generateSkinnedLayers(cancelToken)) {
      for await (let tiledSkinnedTile of tiledMapSkinnedLayer.generateSkinnedTiles(cancelToken)) {
        this.scene.add(tilesetMeshes.getTiledSkinnedTileMesh(tiledSkinnedTile));
        // break;
      }
    }
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
