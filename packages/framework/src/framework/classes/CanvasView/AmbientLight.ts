import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type QuakeWorkerLightAmbient from "src/framework/types/QuakeWorkerLightAmbient";

export default class AmbientLight extends CanvasView {
  readonly light: THREE.AmbientLight;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightAmbient) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.light = new THREE.AmbientLight(0xffffff, entity.light);
  }

  // @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
  }
}
