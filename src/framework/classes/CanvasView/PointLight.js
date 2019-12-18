// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";

import type { Color, Group, OrthographicCamera, PointLight as PointLightInterface } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class PointLight extends CanvasView {
  +cancelToken: CancelToken;
  +color: Color;
  +group: Group;
  +light: PointLightInterface<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, group: Group, origin: Vector3, color: Color, intensity: number, decay: number) {
    super(canvasViewBag);

    this.color = color;
    this.group = group;

    this.light = new THREE.PointLight<OrthographicCamera>(this.color, intensity, 512);
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
