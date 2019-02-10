// @flow

import * as THREE from "three";

import type { CanvasController } from "../interfaces/CanvasController";
import type { ClockTick } from "../../framework/interfaces/ClockTick";
import type { ElementSize } from "../interfaces/ElementSize";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.PerspectiveCamera;
  +light: THREE.PointLight;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 10);
    this.camera.position.z = 3;
    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load(
      "/assets/texture-navy-blue-marble-512.jpg"
    );
    const material = new THREE.MeshPhongMaterial({
      map: texture
    });

    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);

    this.light = new THREE.PointLight();
    this.light.position.set(3, 3, 3);

    this.scene.add(this.light);
  }

  async resize(elementSize: ElementSize): Promise<void> {
    this.camera.aspect = elementSize.getAspect();
    this.camera.updateProjectionMatrix();
  }

  async tick(renderer: THREE.WebGLRenderer, tick: ClockTick): Promise<void> {
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 10);

    renderer.render(this.scene, this.camera);
  }
}
