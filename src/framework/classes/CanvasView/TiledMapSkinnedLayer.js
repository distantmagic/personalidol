// @flow

import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasView from "../CanvasView";
import timeout from "../../helpers/timeout";
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

  async attach(): Promise<void> {
    await super.attach();

    let skinnedTilesLoaded = 0;
    for await (let tiledSkinnedTile of this.tiledMapSkinnedLayer.generateSkinnedTiles(this.cancelToken)) {
      await this.canvasViewBag.add(
        new TiledSkinnedTileCanvasView(
          this.canvasViewBag.fork(this.loggerBreadcrumbs.add("TiledSkinnedTileCanvasView")),
          this.loggerBreadcrumbs.add("TiledSkinnedTileCanvasView"),
          this.scene,
          this.threeTilesetMeshes,
          tiledSkinnedTile
        )
      );
      skinnedTilesLoaded += 1;
      if (0 === skinnedTilesLoaded % 300) {
        // give control back elsewhere for a moment
        // it slows down tiles loading, but makes the entire app more
        // responsive
        await timeout(this.cancelToken, 10);
      }
    }

    this.debug.updateState(this.loggerBreadcrumbs.add("skinnedTilesLoaded"), skinnedTilesLoaded);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.debug.deleteState(this.loggerBreadcrumbs.add("skinnedTilesLoaded"));
    this.cancelToken.cancel(this.loggerBreadcrumbs.add("dispose"));
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
