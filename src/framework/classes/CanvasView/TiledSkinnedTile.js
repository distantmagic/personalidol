// @flow

import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasPointerHandlerReference from "../CanvasPointerHandlerReference";
import CanvasView from "../CanvasView";

import type { Mesh, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasPointerHandler } from "../../interfaces/CanvasPointerHandler";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { THREETilesetMeshes } from "../../interfaces/THREETilesetMeshes";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../../interfaces/TiledSkinnedTile";

export default class TiledSkinnedTile extends CanvasView implements CanvasPointerHandler {
  +cancelToken: CancelTokenInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +threeTilesetMeshes: THREETilesetMeshes;
  +tiledSkinnedTile: TiledSkinnedTileInterface;
  tiledSkinnedTileMesh: ?Mesh;

  constructor(
    canvasViewBag: CanvasViewBag,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: Scene,
    threeTilesetMeshes: THREETilesetMeshes,
    tiledSkinnedTile: TiledSkinnedTileInterface
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeTilesetMeshes = threeTilesetMeshes;
    this.tiledSkinnedTile = tiledSkinnedTile;
  }

  async attach(): Promise<void> {
    await super.attach();

    this.tiledSkinnedTileMesh = this.threeTilesetMeshes.getTiledSkinnedTileMesh(this.tiledSkinnedTile);
    this.tiledSkinnedTileMesh.userData = new CanvasPointerHandlerReference(this);

    this.scene.add(this.tiledSkinnedTileMesh);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    const tiledSkinnedTileMesh = this.tiledSkinnedTileMesh;

    if (!tiledSkinnedTileMesh) {
      return;
    }

    this.scene.remove(tiledSkinnedTileMesh);
  }

  onMouseAuxilaryPressed(): void {
    // console.log('onMouseAuxilaryPressed');
  }

  onMouseOver(): void {
    const tiledSkinnedTileMesh = this.tiledSkinnedTileMesh;

    // console.log('onMouseOver');
    if (tiledSkinnedTileMesh) {
      tiledSkinnedTileMesh.position.y += 0.1;
    }
  }

  onMousePrimaryPressed(): void {
    // console.log('onMousePrimaryPressed');
  }

  onMouseSecondaryPressed(): void {
    // console.log('onMouseSecondaryPressed');
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
