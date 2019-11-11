// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { LoadingManager as THREELoadingManager, Scene } from "three";

import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class QuakeMap extends CanvasView {
  +scene: Scene;
  +source: string;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene, threeLoadingManager: THREELoadingManager, source: string) {
    super(canvasViewBag);
    autoBind(this);

    this.scene = scene;
    this.source = source;
  }

  async attach(): Promise<void> {
    await super.attach();

    var gt = new THREE.TextureLoader().load("/assets/texture-brown-rock-128.jpg");
    var gg = new THREE.PlaneBufferGeometry(2000, 2000);
    var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });
    var ground = new THREE.Mesh(gg, gm);
    ground.rotation.x = -Math.PI / 2;
    ground.material.map.repeat.set(16, 16);
    ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.receiveShadow = true;

    this.scene.add(ground);
  }

  async dispose(): Promise<void> {
    await super.dispose();
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
