import * as THREE from "three";

import CanvasView from "../CanvasView";

import { Color, Group, PointLight as PointLightInterface, Vector3 } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class PointLight extends CanvasView {
  readonly color: Color;
  readonly group: Group;
  readonly light: PointLightInterface;

  constructor(canvasViewBag: CanvasViewBag, group: Group, origin: Vector3, color: Color, intensity: number, decay: number) {
    super(canvasViewBag);

    this.color = color;
    this.group = group;

    this.light = new THREE.PointLight(this.color, intensity, 512);
    this.light.position.copy(origin);

    // this.light.decay = 4;
    this.light.decay = decay;
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
