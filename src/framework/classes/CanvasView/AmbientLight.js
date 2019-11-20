// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Light, OrthographicCamera, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelToken;
  +scene: Scene;
  +light: Light<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene, brightness: number) {
    super(canvasViewBag);
    autoBind(this);

    this.scene = scene;

    this.light = new THREE.AmbientLight(0xffffff, brightness);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.scene.add(this.light);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.light);
  }
}
