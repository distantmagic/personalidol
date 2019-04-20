// @flow

import * as THREE from "three";

import type { CancelToken } from "../framework/interfaces/CancelToken";
import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../framework/interfaces/PointerState";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";
import type { THREEPointerInteraction } from "../framework/interfaces/THREEPointerInteraction";
import type { TiledMap } from "../framework/interfaces/TiledMap";

export default class Plane implements CanvasView {
  +plane: THREE.Group;
  +pointerState: PointerState;
  +scene: THREE.Scene;
  +threeLoadingManager: THREELoadingManager;
  +threePointerInteraction: THREEPointerInteraction;
  +tiledMap: TiledMap;
  +wireframe: THREE.LineSegments;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    pointerState: PointerState,
    threeLoadingManager: THREELoadingManager,
    threePointerInteraction: THREEPointerInteraction,
    tiledMap: TiledMap
  ) {
    this.pointerState = pointerState;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.threePointerInteraction = threePointerInteraction;
    this.tiledMap = tiledMap;

    this.plane = new THREE.Group();

    // const boxGeometry = new THREE.BoxGeometry(10, 16, 10);
    const boxGeometry = new THREE.BoxGeometry(1, 0.6, 1);
    const geo = new THREE.EdgesGeometry(boxGeometry); // or WireframeGeometry( geometry )
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    });
    const wireframe = new THREE.LineSegments(geo, mat);

    wireframe.position.x = 0;
    // wireframe.position.y = 8.1;
    wireframe.position.y = 0.31;
    wireframe.position.z = 0;

    this.wireframe = wireframe;
  }

  async attach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    const tileGeometry = new THREE.PlaneGeometry(1, 1);

    tileGeometry.translate(-0.5, -0.5, 0);

    const textureLoader = new THREE.TextureLoader(
      this.threeLoadingManager.getLoadingManager()
    );
    const tiledTileset = this.tiledMap.getTiledTileset();
    const tileMaterials = new Map<number, THREE.Material>();

    for (let tile of tiledTileset.getTiles().values()) {
      tileMaterials.set(
        tile.getId(),
        new THREE.MeshPhongMaterial({
          // color: [0xcccccc, 0xdddddd, 0xaaaaaa, 0x999999][random(0, 3)]
          map: textureLoader.load(tile.getTiledTileImage().getSource())
          // roughness: 1,
          // side: THREE.DoubleSide
        })
      );
    }

    for await (let layer of this.tiledMap.generateSkinnedLayers(cancelToken)) {
      for await (let tile of layer.generateSkinnedTiles(cancelToken)) {
        const tileMaterial = tileMaterials.get(tile.getId());

        if (!tileMaterial) {
          throw new Error(
            `Tile material does not exist but was expected: ${tile.getId()}`
          );
        }

        const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
        const tilePosition = tile.getElementPosition();

        tileMesh.position.x = tilePosition.getX();
        tileMesh.position.z = tilePosition.getY();
        tileMesh.rotation.x = (-1 * Math.PI) / 2;
        tileMesh.rotation.y = 0;
        tileMesh.rotation.z = Math.PI / 2;

        this.plane.add(tileMesh);
      }
    }

    const tiledMapObjectMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000
    });

    for (let tiledMapObject of this.tiledMap.getObjects()) {
      const tiledMapObjectSize = tiledMapObject.getElementSize();
      const tiledMapObjectGeometry = new THREE.BoxGeometry(
        tiledMapObjectSize.getWidth(),
        tiledMapObjectSize.getDepth(),
        tiledMapObjectSize.getHeight()
      );

      tiledMapObjectGeometry.translate(0, tiledMapObjectSize.getDepth() / 2, 0);

      const tiledMapObjectMesh = new THREE.Mesh(
        tiledMapObjectGeometry,
        tiledMapObjectMaterial
      );

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

    this.scene.add(this.wireframe);
    this.scene.add(this.plane);
  }

  async detach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    this.scene.remove(this.plane);
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {}

  update(delta: number): void {
    if (!this.pointerState.isPressed("Primary")) {
      this.scene.remove(this.wireframe);

      return;
    }

    const intersects = this.threePointerInteraction
      .getCameraRaycaster()
      .intersectObjects(this.plane.children);
    if (intersects.length < 1) {
      this.scene.remove(this.wireframe);
    } else {
      this.scene.add(this.wireframe);
    }

    for (let intersect of intersects) {
      // console.log(intersects.length);
      this.wireframe.position.x = intersect.object.position.x;
      this.wireframe.position.z = intersect.object.position.z;
      // intersect.object.material.color.set( 0x333333 );
    }
  }
}
