import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type QuakeWorkerLightSpotlight from "src/framework/types/QuakeWorkerLightSpotlight";

export default class SpotLight extends CanvasView {
  readonly color: THREE.Color;
  readonly light: THREE.SpotLight;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerLightSpotlight) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.color = new THREE.Color(parseInt(entity.color, 16));

    this.light = new THREE.SpotLight(this.color.getHex(), entity.intensity);
    this.light.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);
    this.light.target.position.set(entity.origin[0], 0, entity.origin[2]);

    this.light.angle = Math.PI / 3;
    this.light.decay = entity.decay;
    this.light.distance = 512;
    this.light.penumbra = 1;
    this.light.castShadow = true;
    this.light.shadow.camera.far = 512;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.children.add(this.light);
    this.children.add(this.light.target);
  }

  getName(): "SpotLight" {
    return "SpotLight";
  }
}
