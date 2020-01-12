import * as THREE from "three";

import CanvasView from "../CanvasView";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { QuakeWorkerLightHemisphere } from "../../types/QuakeWorkerLightHemisphere";

export default class AmbientLight extends CanvasView {
  readonly group: THREE.Group;
  readonly light: THREE.HemisphereLight;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightHemisphere) {
    super(canvasViewBag);

    this.group = group;
    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, entity.light);
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
