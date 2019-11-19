// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Light, OrthographicCamera, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class PointLight extends CanvasView {
  +cancelToken: CancelToken;
  +scene: Scene;
  +light: Light<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene, origin: Vector3, brightness: number) {
    super(canvasViewBag);
    autoBind(this);

    this.scene = scene;

    this.light = new THREE.PointLight<OrthographicCamera>(0xffffff, brightness);
    this.light.position.copy(origin);

    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    // this one is important on mobile (ios at least)
    // https://stackoverflow.com/questions/50945270/threejs-shadow-artifact-ios-devices
    this.light.shadow.camera.near = 20;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.scene.add(this.light);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.light);
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
