// @flow

import * as THREE from "three";

import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

const planeSide = 128;

export default class Plane implements CanvasView {
  +plane: THREE.Mesh;
  +scene: THREE.Scene;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene
  ) {
    this.scene = scene;

    const geometry = new THREE.PlaneGeometry(planeSide, planeSide, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xcccccc
      // roughness: 1,
      // side: THREE.DoubleSide
    });

    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = (-1 * Math.PI) / 2;
    this.plane.rotation.y = 0;
    this.plane.rotation.z = Math.PI / 2;

    // this.scene.add(plane);
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
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
