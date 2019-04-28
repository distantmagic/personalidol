// @flow

import * as THREE from "three";

import FBXLoader from "../../three/FBXLoader";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { TiledMap } from "../../framework/interfaces/TiledMap";
import type { TiledMapBlockObject } from "../../framework/interfaces/TiledMapBlockObject";
import type { TiledMapPositionedObject } from "../../framework/interfaces/TiledMapPositionedObject";

export default class GameboardTiledObjects implements CanvasView {
  +tiledMap: TiledMap;
  +scene: THREE.Scene;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    scene: THREE.Scene,
    threeLoadingManager: THREELoadingManager,
    tiledMap: TiledMap
  ) {
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.tiledMap = tiledMap;
  }

  addTiledMapBlockGeometry(
    tiledMapObject: TiledMapBlockObject,
    tiledMapObjectGeometry: THREE.Geometry,
    tiledMapObjectMaterial: THREE.Material
  ): void {
    const tiledMapObjectSize = tiledMapObject.getElementSize();
    tiledMapObjectGeometry.translate(
      tiledMapObjectSize.getWidth() / 2,
      tiledMapObjectSize.getDepth() / 2,
      tiledMapObjectSize.getHeight() / 2
    );

    const tiledMapObjectMesh = new THREE.Mesh(
      tiledMapObjectGeometry,
      tiledMapObjectMaterial
    );

    this.addTiledMapPositionedMesh(tiledMapObject, tiledMapObjectMesh);
  }

  addTiledMapPositionedMesh(
    tiledMapObject: TiledMapPositionedObject,
    tiledMapObjectMesh: THREE.Mesh
  ) {
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

  async attach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    const loader = new FBXLoader(this.threeLoadingManager.getLoadingManager());

    // ellipses

    const tiledMapObjectMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000
    });

    for (let tiledMapObject of this.tiledMap.getEllipseObjects()) {
      const tiledMapObjectSize = tiledMapObject.getElementSize();
      const tiledMapObjectGeometry = new THREE.CylinderGeometry(
        tiledMapObjectSize.getWidth() / 2,
        tiledMapObjectSize.getWidth() / 2,
        tiledMapObjectSize.getDepth(),
        16
      );

      this.addTiledMapBlockGeometry(
        tiledMapObject,
        tiledMapObjectGeometry,
        tiledMapObjectMaterial
      );
    }

    // rectangles

    for (let tiledMapObject of this.tiledMap.getRectangleObjects()) {
      if (tiledMapObject.hasSource()) {
        const mesh = await new Promise((resolve, reject) => {
          loader.load(tiledMapObject.getSource(), resolve, null, reject);
        });
        const tiledMapObjectPosition = tiledMapObject.getElementPosition();
        const tiledMapObjectSize = tiledMapObject.getElementSize();

        mesh.scale.set(0.01, 0.01, 0.01);
        mesh.position.set(
          tiledMapObjectPosition.getX() + tiledMapObjectSize.getWidth() / 2,
          tiledMapObjectPosition.getZ(),
          tiledMapObjectPosition.getY() + tiledMapObjectSize.getHeight() / 2
        );

        this.scene.add(mesh);
      } else {
        const tiledMapObjectSize = tiledMapObject.getElementSize();
        const tiledMapObjectGeometry = new THREE.BoxGeometry(
          tiledMapObjectSize.getWidth(),
          tiledMapObjectSize.getDepth(),
          tiledMapObjectSize.getHeight()
        );

        this.addTiledMapBlockGeometry(
          tiledMapObject,
          tiledMapObjectGeometry,
          tiledMapObjectMaterial
        );
      }
    }

    // polygons

    for (let tiledMapObject of this.tiledMap.getPolygonObjects()) {
      const shape = new THREE.Shape();

      for (let polygonPoint of tiledMapObject.getPolygonPoints()) {
        // inversed, because otherwise is mirrored after geometry rotation
        shape.lineTo(polygonPoint.getY(), polygonPoint.getX());
      }

      // const geometry = new THREE.ShapeGeometry(shape);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        bevelEnabled: false,
        depth: tiledMapObject.getDepth()
        // steps: 2,
      });

      // rotate so the only side available is up
      geometry.rotateX((-1 * Math.PI) / 2);
      // now it is aligned correctly
      geometry.rotateY((-1 * Math.PI) / 2);

      const mesh = new THREE.Mesh(geometry, tiledMapObjectMaterial);

      this.addTiledMapPositionedMesh(tiledMapObject, mesh);
    }
  }

  async detach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {}

  update(delta: number): void {}
}
