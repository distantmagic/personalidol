// @flow

import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasPointerEventHandlerReference from "../CanvasPointerEventHandlerReference";
import CanvasView from "../CanvasView";

import type { Mesh, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { THREETilesetMeshes } from "../../interfaces/THREETilesetMeshes";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../../interfaces/TiledSkinnedTile";

export default class TiledSkinnedTile extends CanvasView {
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
    this.tiledSkinnedTileMesh.userData = new CanvasPointerEventHandlerReference(this);

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

  onPointerAuxiliaryClick(): void {
    super.onPointerAuxiliaryClick();

    const tiledSkinnedTileMesh = this.tiledSkinnedTileMesh;

    if (!tiledSkinnedTileMesh) {
      return;
    }

    tiledSkinnedTileMesh.position.y -= 0.3;
  }

  onPointerPrimaryClick(): void {
    super.onPointerPrimaryClick();

    const tiledSkinnedTileMesh = this.tiledSkinnedTileMesh;

    if (!tiledSkinnedTileMesh) {
      return;
    }

    tiledSkinnedTileMesh.position.y += 0.3;
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
