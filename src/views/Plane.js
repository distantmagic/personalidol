// @flow

import * as THREE from "three";
import random from "lodash/random";

import type { CancelToken } from "../framework/interfaces/CancelToken";
import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../framework/interfaces/PointerState";
import type { THREEPointerInteraction } from "../framework/interfaces/THREEPointerInteraction";

export default class Plane implements CanvasView {
  +plane: THREE.Group;
  +planeSide: number;
  +pointerState: PointerState;
  +scene: THREE.Scene;
  +threePointerInteraction: THREEPointerInteraction;
  +wireframe: THREE.LineSegments;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    planeSide: number,
    pointerState: PointerState,
    threePointerInteraction: THREEPointerInteraction
  ) {
    this.pointerState = pointerState;
    this.scene = scene;
    this.threePointerInteraction = threePointerInteraction;

    const geometrySide = 1;
    const geometry = new THREE.PlaneGeometry(geometrySide, geometrySide);

    this.plane = new THREE.Group();

    const halfSide = planeSide / 2;

    for (let x = -1 * halfSide; x < halfSide; x += 1) {
      for (let z = -1 * halfSide; z < halfSide; z += 1) {
        const material = new THREE.MeshPhongMaterial({
          color: [0xcccccc, 0xdddddd, 0xaaaaaa, 0x999999][random(0, 3)]
          // roughness: 1,
          // side: THREE.DoubleSide
        });
        const tile = new THREE.Mesh(geometry, material);

        tile.position.x = x * geometrySide;
        tile.position.z = z * geometrySide;
        tile.rotation.x = (-1 * Math.PI) / 2;
        tile.rotation.y = 0;
        tile.rotation.z = Math.PI / 2;

        this.plane.add(tile);
      }
    }

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
