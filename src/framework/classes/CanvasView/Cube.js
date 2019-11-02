// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Mesh, Scene } from "three";

export default class Cube extends CanvasView {
  +scene: Scene;
  cube: ?Mesh;
  isAttached: boolean;

  constructor(scene: Scene) {
    super();
    autoBind(this);

    this.isAttached = false;
    this.scene = scene;
  }

  begin(): void {
    if (this.isAttached) {
      return;
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.isAttached = true;
  }

  end(fps: number, isPanicked: boolean): void {
    // console.log('end');
  }

  update(delta: number): void {
    if (!this.cube) {
      return;
    }

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    // this.cube.rotation.z += 0.1;
  }
}
