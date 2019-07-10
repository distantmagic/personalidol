// @flow

import * as THREE from "three";

import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import RuntimeCache from "../../framework/classes/RuntimeCache";
import THREETilesetMaterials from "../../framework/classes/THREETilesetMaterials";
import THREETilesetMeshes from "../../framework/classes/THREETilesetMeshes";
import TiledCustomProperty from "../../framework/classes/TiledCustomProperty";
import TiledMapLoader from "../../framework/classes/TiledMapLoader";
import TiledTilesetLoader from "../../framework/classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../../framework/classes/URLTextContentQueryBuilder";

import type { Material, Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { RuntimeCache as RuntimeCacheInterface } from "../../framework/interfaces/RuntimeCache";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { TiledMapLoader as TiledMapLoaderInterface } from "../../framework/interfaces/TiledMapLoader";

export default class TilesView implements CanvasView {
  +canvasViewGroup: CanvasViewGroupInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapFilename: string;
  +materialsCache: RuntimeCacheInterface<Material>;
  +queryBus: QueryBus;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  +tiledMapLoader: TiledMapLoaderInterface;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    mapFilename: string
  ) {
    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs.add("CanvasViewGroup"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapFilename = mapFilename;
    this.materialsCache = new RuntimeCache<Material>(loggerBreadcrumbs.add("RuntimeCache"));
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

    const tiledMap = await this.tiledMapLoader.load(cancelToken, this.mapFilename);
    const tilesetMaterials = new THREETilesetMaterials(
      this.loggerBreadcrumbs.add("THREETilesetMaterials"),
      this.materialsCache,
      this.threeLoadingManager
    );
    const tilesetMeshes = new THREETilesetMeshes(this.loggerBreadcrumbs.add("THREETilesetMeshes"), tilesetMaterials);
    const walkabilityCustomProperty = new TiledCustomProperty(
      this.loggerBreadcrumbs.add("TiledCustomProperty"),
      "isWalkabilityMap",
      "bool",
      "true"
    );

    for await (let tiledMapSkinnedLayer of tiledMap.generateSkinnedLayers(cancelToken)) {
      const isWalkabilityMap = tiledMapSkinnedLayer
        .getTiledMapLayer()
        .getTiledCustomProperties()
        .hasProperty(walkabilityCustomProperty);

      if (isWalkabilityMap) {
        continue;
      }

      for await (let tiledSkinnedTile of tiledMapSkinnedLayer.generateSkinnedTiles(cancelToken)) {
        this.scene.add(tilesetMeshes.getTiledSkinnedTileMesh(tiledSkinnedTile));
        // break;
      }
    }
  }

  begin(): void {
    return this.canvasViewGroup.begin();
  }

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.detach(cancelToken, renderer);
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
