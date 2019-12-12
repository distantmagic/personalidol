// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";

import type { Group, Light, OrthographicCamera } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelToken;
  +group: Group;
  +light: Light<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, group: Group, brightness: number) {
    super(canvasViewBag);

    this.group = group;
    this.light = new THREE.AmbientLight(0xffffff, brightness);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.group.add(this.light);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.group.remove(this.light);
  }
}
