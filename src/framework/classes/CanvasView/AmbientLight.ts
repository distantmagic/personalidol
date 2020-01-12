import * as THREE from "three";

import CanvasView from "../CanvasView";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { QuakeWorkerLightAmbient } from "../../types/QuakeWorkerLightAmbient";

export default class AmbientLight extends CanvasView {
  readonly group: THREE.Group;
  readonly light: THREE.AmbientLight;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightAmbient) {
    super(canvasViewBag);

    this.group = group;
    this.light = new THREE.AmbientLight(0xffffff, entity.light);
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
