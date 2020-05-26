import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type QuakeWorkerLightPoint from "src/framework/types/QuakeWorkerLightPoint";

export default class PointLight extends CanvasView {
  readonly color: THREE.Color;
  readonly light: THREE.PointLight;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightPoint) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.color = new THREE.Color(parseInt(entity.color, 16));

    this.light = new THREE.PointLight(this.color, entity.intensity, 512);
    this.light.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);

    // this.light.decay = 4;
    this.light.decay = entity.decay;
    this.light.castShadow = true;
    this.light.shadow.camera.far = 512;
  }

  // @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
  }
}
