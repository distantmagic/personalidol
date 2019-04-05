// @flow

import autoBind from "auto-bind";
import * as THREE from "three";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { ClockTick } from "../framework/interfaces/ClockTick";
import type { ElementSize } from "../framework/interfaces/ElementSize";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.PerspectiveCamera;
  +geometry: THREE.Geometry;
  +light: THREE.PointLight;
  +material: THREE.Material;
  +mesh: THREE.Mesh;
  +scene: THREE.Scene;
  +texture: THREE.Texture;

  constructor() {
    autoBind(this);

    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 10);
    this.camera.position.z = 3;
    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.texture = new THREE.TextureLoader().load(
      "/assets/texture-navy-blue-marble-512.jpg"
    );
    this.material = new THREE.MeshPhongMaterial({
      map: this.texture
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.light = new THREE.PointLight();
    this.light.position.set(3, 3, 3);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.add(this.mesh);
    this.scene.add(this.light);
  }

  async begin(tick: ClockTick): Promise<void> {}

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.light);
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }

  async draw(renderer: THREE.WebGLRenderer, tick: ClockTick): Promise<void> {
    renderer.render(this.scene, this.camera);
  }

  async end(renderer: THREE.WebGLRenderer, tick: ClockTick): Promise<void> {}

  async resize(elementSize: ElementSize): Promise<void> {
    this.camera.aspect = elementSize.getAspect();
    this.camera.updateProjectionMatrix();
  }

  async update(tick: ClockTick): Promise<void> {
    // this.light.position.y += 0.1;

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    // this.mesh.scale.x = ((this.mesh.scale.x + 0.1) % 6);
  }
}
