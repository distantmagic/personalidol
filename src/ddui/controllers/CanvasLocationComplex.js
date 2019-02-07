// @flow

import * as THREE from "three";

import type { CanvasController } from "../interfaces/CanvasController";
import type { ClockTick } from "../../framework/interfaces/ClockTick";

export default class CanvasLocationComplex
  implements CanvasController<HTMLCanvasElement> {
  _initialized: boolean;
  camera: THREE.PerspectiveCamera;
  light: THREE.PointLight;
  mesh: THREE.Mesh;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;

  constructor() {
    this._initialized = false;
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.camera = new THREE.PerspectiveCamera(
      70,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      10
    );
    this.camera.position.z = 3;
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load(
      "/assets/texture-mineshaft-marble-512.png"
    );
    const material = new THREE.MeshPhongMaterial({
      map: texture
    });

    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);

    this.light = new THREE.PointLight();
    this.light.position.set(2, 2, 2);

    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });

    this._initialized = true;
  }

  async destroy(canvas: HTMLCanvasElement): Promise<void> {
    this._initialized = false;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

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
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 10);

    this.renderer.render(this.scene, this.camera);
  }
}
