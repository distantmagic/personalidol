import * as THREE from "three";

import CanvasView from "../CanvasView";

import { AmbientLight as THREEAmbientLight, Group } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class AmbientLight extends CanvasView {
  readonly group: Group;
  readonly light: THREEAmbientLight;

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
