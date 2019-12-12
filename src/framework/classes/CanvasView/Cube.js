// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";

import type { Mesh, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class Cube extends CanvasView {
  +scene: Scene;
  cube: ?Mesh;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene) {
    super(canvasViewBag);

    this.scene = scene;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    if (!this.cube) {
      return;
    }

    this.scene.remove(this.cube);
  }

  update(delta: number): void {
    super.update(delta);

    if (!this.cube) {
      return;
    }

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    // this.cube.rotation.z += 0.1;
  }

  useUpdate(): boolean {
    return true;
  }
}
