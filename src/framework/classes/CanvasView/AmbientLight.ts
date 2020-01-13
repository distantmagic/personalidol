import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QuakeWorkerLightAmbient } from "src/framework/types/QuakeWorkerLightAmbient";

export default class AmbientLight extends CanvasView {
  readonly light: THREE.AmbientLight;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightAmbient) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.light = new THREE.AmbientLight(0xffffff, entity.light);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
  }

  getName(): "AmbientLight" {
    return "AmbientLight";
  }
}
