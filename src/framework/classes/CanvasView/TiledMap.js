// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasView from "../CanvasView";
import RuntimeCache from "../RuntimeCache";
import THREETilesetMaterials from "../THREETilesetMaterials";
import THREETilesetMeshes from "../THREETilesetMeshes";
import TiledMapLoader from "../TiledMapLoader";
import TiledTilesetLoader from "../TiledTilesetLoader";
import URLTextContentQueryBuilder from "../URLTextContentQueryBuilder";
import { default as TiledMapSkinnedLayerCanvasView } from "./TiledMapSkinnedLayer";

import type { Material, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { RuntimeCache as RuntimeCacheInterface } from "../../interfaces/RuntimeCache";
import type { THREELoadingManager } from "../../interfaces/THREELoadingManager";
import type { THREETilesetMaterials as THREETilesetMaterialsInterface } from "../../interfaces/THREETilesetMaterials";
import type { THREETilesetMeshes as THREETilesetMeshesInterface } from "../../interfaces/THREETilesetMeshes";
import type { TiledMapLoader as TiledMapLoaderInterface } from "../../interfaces/TiledMapLoader";

const TILED_MAP_FILENAME = "assets/map-outlands-01.tmx";

export default class TiledMap extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +runtimeMaterialsCache: RuntimeCacheInterface<Material>;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  +threeTilesetMaterials: THREETilesetMaterialsInterface;
  +threeTilesetMeshes: THREETilesetMeshesInterface;
  +tiledMapLoader: TiledMapLoaderInterface;

  constructor(
    canvasViewBag: CanvasViewBag,
    debug: Debugger,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    const tiledQueryBuilder = new URLTextContentQueryBuilder();
    const tileGeometry = new THREE.PlaneBufferGeometry(1, 1);

    tileGeometry.translate(-0.5, -0.5, 0);

    this.cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
    this.debug = debug;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.runtimeMaterialsCache = new RuntimeCache<Material>(loggerBreadcrumbs.add("RuntimeCache"));
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.threeTilesetMaterials = new THREETilesetMaterials(
      loggerBreadcrumbs.add("THREETilesetMaterials"),
      this.runtimeMaterialsCache,
      threeLoadingManager
    );
    this.threeTilesetMeshes = new THREETilesetMeshes(
      loggerBreadcrumbs.add("THREETilesetMeshes"),
      this.threeTilesetMaterials,
      tileGeometry
    );
    this.tiledMapLoader = new TiledMapLoader(
      loggerBreadcrumbs.add("TiledMapLoader"),
      queryBus,
      tiledQueryBuilder,
      new TiledTilesetLoader(loggerBreadcrumbs.add("TiledTilesetLoader"), queryBus, tiledQueryBuilder)
    );
  }

  async attach(): Promise<void> {
    await super.attach();

    const tiledMap = await this.tiledMapLoader.load(this.cancelToken, TILED_MAP_FILENAME);

    this.debug.updateState(this.loggerBreadcrumbs.add("TILED_MAP_FILENAME"), TILED_MAP_FILENAME);

    let skinnedLayersLoaded = 0;
    for await (let skinnedLayer of tiledMap.generateSkinnedLayers(this.cancelToken)) {
      const tiledMapLayerView = new TiledMapSkinnedLayerCanvasView(
        this.canvasViewBag.fork(this.loggerBreadcrumbs.add("TiledMapSkinnedLayerCanvasView")),
        this.debug,
        this.loggerBreadcrumbs.add("TiledMapSkinnedLayerCanvasView").addVariable(String(skinnedLayersLoaded)),
        this.scene,
        this.threeTilesetMeshes,
        skinnedLayer
      );

      await this.loadingManager.blocking(
        this.canvasViewBag.add(tiledMapLayerView),
        `Loading map layer #${skinnedLayersLoaded + 1}`
      );
      skinnedLayersLoaded += 1;
    }

    this.debug.updateState(
      this.loggerBreadcrumbs.add(TILED_MAP_FILENAME).add("skinnedLayersLoaded"),
      skinnedLayersLoaded
    );
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.cancelToken.cancel(this.loggerBreadcrumbs.add("dispose"));
    this.debug.deleteState(this.loggerBreadcrumbs.add("TILED_MAP_FILENAME"));
    this.debug.deleteState(this.loggerBreadcrumbs.add(TILED_MAP_FILENAME).add("skinnedLayersLoaded"));
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
