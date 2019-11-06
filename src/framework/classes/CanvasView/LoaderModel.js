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

    const mesh1 = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player1 = new THREE.Group();

    // bones
    player1.add(mesh1.children[0]);

    // body [1-7]
    player1.add(mesh1.children[1]);

    // head [8-14]
    player1.add(mesh1.children[9]);

    player1.position.set(0.5, 0, 0.5);
    player1.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player1);

    const mesh2 = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player2 = new THREE.Group();

    // bones
    player2.add(mesh2.children[0]);

    // body [1-7]
    player2.add(mesh2.children[2]);

    // head [8-14]
    player2.add(mesh2.children[10]);

    player2.position.set(1.5, 0, 1.5);
    player2.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player2);

    const mesh3 = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player3 = new THREE.Group();

    // bones
    player3.add(mesh3.children[0]);

    // body [1-7]
    player3.add(mesh3.children[3]);

    // head [8-14]
    player3.add(mesh3.children[11]);

    player3.position.set(2.5, 0, 0.5);
    player3.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player3);

    const mesh4 = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player4 = new THREE.Group();

    // bones
    player4.add(mesh4.children[0]);

    // body [1-7]
    player4.add(mesh4.children[5]);

    // head [8-14]
    player4.add(mesh4.children[13]);

    player4.position.set(3.5, 0, 1.5);
    player4.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player4);

    const mesh5 = await this.threeMeshLoader.load(
      this.cancelToken,
      "/assets/mesh-default-character.fbx",
      "/assets/mesh-default-character/"
    );
    const player5 = new THREE.Group();

    // bones
    player5.add(mesh5.children[0]);

    // body [1-7]
    player5.add(mesh5.children[6]);

    // head [8-14]
    player5.add(mesh5.children[14]);

    player5.position.set(0.5, 0, 2.5);
    player5.scale.set(0.01, 0.01, 0.01);

    this.scene.add(player5);
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
