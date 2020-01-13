import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { QuakeWorkerLightHemisphere } from "src/framework/types/QuakeWorkerLightHemisphere";

export default class AmbientLight extends CanvasView {
  readonly light: THREE.HemisphereLight;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightHemisphere) {
    super(canvasViewBag, group);

    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, entity.light);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.children.remove(this.light);
  }
}
