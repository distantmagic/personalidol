// import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";

export default class Player extends CanvasView {
  readonly group: THREE.Group;
  readonly origin: THREE.Vector3;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, origin: THREE.Vector3) {
    super(canvasViewBag);

    this.group = group;
    this.origin = origin;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    console.log("ATTACH PLAYER", this.origin);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }
}
