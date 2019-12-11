// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Group, OrthographicCamera, PointLight as PointLightInterface } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class PointLight extends CanvasView {
  +cancelToken: CancelToken;
  +group: Group;
  +light: PointLightInterface<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, group: Group, origin: Vector3, intensity: number, decay: number = 0.2) {
    super(canvasViewBag);
    autoBind(this);

    this.group = group;

    this.light = new THREE.PointLight<OrthographicCamera>(0xffffff, intensity, 512, 2);
    this.light.position.copy(origin);

    this.light.decay = 0.2;
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;

    // this one is important on mobile (ios at least)
    // https://stackoverflow.com/questions/50945270/threejs-shadow-artifact-ios-devices
    // this.light.shadow.camera.near = 20;
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
