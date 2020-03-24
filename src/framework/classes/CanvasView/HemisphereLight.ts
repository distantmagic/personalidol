import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type QuakeWorkerLightHemisphere from "src/framework/types/QuakeWorkerLightHemisphere";

export default class HemisphereLight extends CanvasView {
  readonly light: THREE.HemisphereLight;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightHemisphere) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, entity.light);
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
  }

  getName(): "HemisphereLight" {
    return "HemisphereLight";
  }
}
