// @flow

import * as THREE from "three";
import THREEMeshLoader from "../../framework/classes/THREEMeshLoader";

import type { Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { THREEMeshLoader as THREEMeshLoaderInterface } from "../../framework/interfaces/THREEMeshLoader";
import type { TiledMap } from "../../framework/interfaces/TiledMap";
import type { TiledMapPositionedObject } from "../../framework/interfaces/TiledMapPositionedObject";
import type { TiledMapRectangleObject } from "../../framework/interfaces/TiledMapRectangleObject";

export default class TiledMapRectanglesView implements CanvasView {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +threeMeshLoader: THREEMeshLoaderInterface;
  +threeLoadingManager: THREELoadingManager;
  +tiledMap: TiledMap;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    tiledMap: TiledMap
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.threeMeshLoader = new THREEMeshLoader(loggerBreadcrumbs.add("THREEMeshLoader"), queryBus, threeLoadingManager);
    this.tiledMap = tiledMap;
  }

  addTiledMapBlockGeometry(
    tiledMapObject: TiledMapRectangleObject,
    tiledMapObjectGeometry: THREE.Geometry,
    tiledMapObjectMaterial: THREE.Material
  ): void {
    const tiledMapBlockObject = tiledMapObject.getTiledMapBlockObject();
    const tiledMapObjectSize = tiledMapBlockObject.getElementSize();
    tiledMapObjectGeometry.translate(
      tiledMapObjectSize.getWidth() / 2,
      tiledMapObjectSize.getDepth() / 2,
      tiledMapObjectSize.getHeight() / 2
    );

    const tiledMapObjectMesh = new THREE.Mesh(tiledMapObjectGeometry, tiledMapObjectMaterial);

    this.addTiledMapPositionedMesh(tiledMapBlockObject.getTiledMapPositionedObject(), tiledMapObjectMesh);
  }

  addTiledMapPositionedMesh(tiledMapObject: TiledMapPositionedObject, tiledMapObjectMesh: THREE.Mesh) {
    const tiledMapObjectPosition = tiledMapObject.getElementPosition();
    tiledMapObjectMesh.position.set(
      tiledMapObjectPosition.getX(),
      tiledMapObjectPosition.getZ(),
      tiledMapObjectPosition.getY()
    );

    const tiledMapObjectRotation = tiledMapObject.getElementRotation();
    tiledMapObjectMesh.rotation.set(
      tiledMapObjectRotation.getRotationX(),
      tiledMapObjectRotation.getRotationZ(),
      tiledMapObjectRotation.getRotationY()
    );

    this.scene.add(tiledMapObjectMesh);
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    const tiledMapObjectMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });

    await Promise.all(
      this.tiledMap.getRectangleObjects().map(tiledMapObject => {
        return this.attachTiledMapObject(cancelToken, tiledMapObject, tiledMapObjectMaterial);
      })
    );
  }

  async attachTiledMapObject(
    cancelToken: CancelToken,
    tiledMapObject: TiledMapRectangleObject,
    tiledMapObjectMaterial: Material
  ): Promise<void> {
    const tiledMapBlockObject = tiledMapObject.getTiledMapBlockObject();
    const tiledMapObjectSize = tiledMapBlockObject.getElementSize();

    if (tiledMapBlockObject.hasSource()) {
      const mesh = await this.threeMeshLoader.load(cancelToken, tiledMapBlockObject.getSource());
      const tiledMapObjectPosition = tiledMapBlockObject.getTiledMapPositionedObject().getElementPosition();

      mesh.scale.set(0.01, 0.01, 0.01);
      mesh.position.set(
        tiledMapObjectPosition.getX() + tiledMapObjectSize.getWidth() / 2,
        tiledMapObjectPosition.getZ(),
        tiledMapObjectPosition.getY() + tiledMapObjectSize.getHeight() / 2
      );

      this.scene.add(mesh);
    } else {
      const tiledMapObjectGeometry = new THREE.BoxGeometry(
        tiledMapObjectSize.getWidth(),
        tiledMapObjectSize.getDepth(),
        tiledMapObjectSize.getHeight()
      );

      this.addTiledMapBlockGeometry(tiledMapObject, tiledMapObjectGeometry, tiledMapObjectMaterial);
    }
  }

  begin(): void {}

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {}
}
