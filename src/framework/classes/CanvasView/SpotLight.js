// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";

import type { Color, Group, SpotLight as SpotLightInterface } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class SpotLight extends CanvasView {
  +cancelToken: CancelToken;
  +color: Color;
  +group: Group;
  +light: SpotLightInterface;

  constructor(canvasViewBag: CanvasViewBag, group: Group, origin: Vector3, color: Color, intensity: number, decay: number) {
    super(canvasViewBag);

    this.color = color;
    this.group = group;

    this.light = new THREE.SpotLight(this.color.getHex(), intensity);
    this.light.position.copy(origin);
    this.light.target.position.set(origin.x, 0, origin.z);

    this.light.angle = 1;
    this.light.decay = decay;
    this.light.distance = 512;
    this.light.penumbra = 1;
    this.light.castShadow = true;
    this.light.shadow.camera.far = 512;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.group.add(this.light);
    this.group.add(this.light.target);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.group.remove(this.light.target);
  }
}
