// @flow

import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasView from "../CanvasView";
import { default as TiledSkinnedTileCanvasView } from "./TiledSkinnedTile";

import type { Material, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { RuntimeCache as RuntimeCacheInterface } from "../../interfaces/RuntimeCache";
import type { THREETilesetMeshes } from "../../interfaces/THREETilesetMeshes";
import type { TiledMapSkinnedLayer as TiledMapSkinnedLayerInterface } from "../../interfaces/TiledMapSkinnedLayer";

export default class TiledMapSkinnedLayer extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +runtimeCache: RuntimeCacheInterface<Material>;
  +scene: Scene;
  +threeTilesetMeshes: THREETilesetMeshes;
  +tiledMapSkinnedLayer: TiledMapSkinnedLayerInterface;

  constructor(
    canvasViewBag: CanvasViewBag,
    debug: Debugger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: Scene,
    threeTilesetMeshes: THREETilesetMeshes,
    tiledMapSkinnedLayer: TiledMapSkinnedLayerInterface
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeTilesetMeshes = threeTilesetMeshes;
    this.tiledMapSkinnedLayer = tiledMapSkinnedLayer;
  }

  attach(): void {
    super.attach();

    this.attachSkinnedTiles();
  }

  async attachSkinnedTiles(): Promise<void> {
    let skinnedTilesLoaded = 0;
    for await (let tiledSkinnedTile of this.tiledMapSkinnedLayer.generateSkinnedTiles(this.cancelToken)) {
      const tiledSkinnedTileCanvasView = new TiledSkinnedTileCanvasView(
        this.canvasViewBag.fork(this.loggerBreadcrumbs.add("TiledSkinnedTileCanvasView")),
        this.loggerBreadcrumbs.add("TiledSkinnedTileCanvasView"),
        this.scene,
        this.threeTilesetMeshes,
        tiledSkinnedTile
      );

      this.canvasViewBag.add(tiledSkinnedTileCanvasView);
      skinnedTilesLoaded += 1;

      if (skinnedTilesLoaded > 1024) {
        break;
      }
    }

    this.debug.updateState(this.loggerBreadcrumbs.add("skinnedTilesLoaded"), skinnedTilesLoaded);
  }

  dispose(): void {
    super.dispose();

    this.cancelToken.cancel(this.loggerBreadcrumbs.add("dispose"));
  }

  update(delta: number): void {
    super.update(delta);
  }
}
