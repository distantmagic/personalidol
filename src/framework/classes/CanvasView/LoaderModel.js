// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CancelToken from "../CancelToken";
import CanvasView from "../CanvasView";
import THREEMeshLoader from "../THREEMeshLoader";

import type { Mesh, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { THREEMeshLoader as THREEMeshLoaderInterface } from "../../interfaces/THREEMeshLoader";
import type { THREELoadingManager } from "../../interfaces/THREELoadingManager";

export default class LoaderModel extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +threeMeshLoader: THREEMeshLoaderInterface;
  cube: ?Mesh;

  constructor(
    canvasViewBag: CanvasViewBag,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.cancelToken = new CancelToken(loggerBreadcrumbs.add("CancelToken"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeMeshLoader = new THREEMeshLoader(loggerBreadcrumbs.add("THREEMeshLoader"), queryBus, threeLoadingManager);
  }

  async attach(): Promise<void> {
    await super.attach();

    const mesh = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player = new THREE.Group();

    // bones
    player.add(mesh.children[0]);

    // body
    player.add(mesh.children[7]);

    // head
    player.add(mesh.children[10]);

    player.position.set(1.5, 0, 1.5);
    player.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.cancelToken.cancel(this.loggerBreadcrumbs.add("dispose"));
  }

  update(delta: number): void {
    super.update(delta);
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
