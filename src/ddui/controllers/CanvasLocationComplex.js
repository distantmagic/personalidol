// @flow

import * as THREE from "three";

import type { CanvasController } from "../interfaces/CanvasController";
import type { ClockTick } from "../../framework/interfaces/ClockTick";

export default class CanvasLocationComplex
  implements CanvasController<HTMLCanvasElement> {
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.camera = new THREE.PerspectiveCamera(
      70,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      10
    );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
  }

  async destroy(canvas: HTMLCanvasElement): Promise<void> {}

  async resize(width: number, height: number): Promise<void> {
    const currentSize = this.renderer.getSize();

    if (currentSize.width === width && currentSize.height === height) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  async tick(canvas: HTMLCanvasElement, tick: ClockTick): Promise<void> {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
  }
}
