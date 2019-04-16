// @flow

import * as THREE from "three";
import random from "lodash/random";

import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

export default class Plane implements CanvasView {
  +plane: THREE.Group;
  +planeSide: number;
  +scene: THREE.Scene;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    planeSide: number
  ) {
    this.scene = scene;

    const geometrySide = 10;
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

    // this.scene.add(plane);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    const boxGeometry = new THREE.BoxGeometry(10, 16, 10);

    const geo = new THREE.EdgesGeometry(boxGeometry); // or WireframeGeometry( geometry )
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    });
    const wireframe = new THREE.LineSegments(geo, mat);

    wireframe.position.x = 0;
    wireframe.position.y = 8.1;
    wireframe.position.z = 0;
    // wireframe.rotation.y = Math.PI / 3;
    // wireframe.scale.set(10, 10, 10);

    this.scene.add(wireframe);

    this.scene.add(this.plane);
  }

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.plane);
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {}

  update(delta: number): void {}
}
