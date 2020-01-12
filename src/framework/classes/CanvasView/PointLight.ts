import * as THREE from "three";

import CanvasView from "../CanvasView";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { QuakeWorkerLightPoint } from "../../types/QuakeWorkerLightPoint";

export default class PointLight extends CanvasView {
  readonly color: THREE.Color;
  readonly group: THREE.Group;
  readonly light: THREE.PointLight;

  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, origin: THREE.Vector3, entity: QuakeWorkerLightPoint) {
    super(canvasViewBag);

    this.color = new THREE.Color(parseInt(entity.color, 16));
    this.group = group;

    this.light = new THREE.PointLight(this.color, entity.intensity, 512);
    this.light.position.copy(origin);

    // this.light.decay = 4;
    this.light.decay = entity.decay;
    this.light.castShadow = true;
    this.light.shadow.camera.far = 512;
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
