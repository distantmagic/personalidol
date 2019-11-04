// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Scene, SpotLight } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +spotLight: SpotLight;

  constructor(canvasViewBag: CanvasViewBag, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.spotLight = new THREE.SpotLight(0xffffff);
  }

  attach(): void {
    super.attach();

    this.spotLight.position.set(512, 512, 512);
    this.debug.updateState(this.loggerBreadcrumbs.add("light").add("position"), this.spotLight.position);
    this.scene.add(this.spotLight);
  }

  dispose(): void {
    super.dispose();

    this.scene.remove(this.spotLight);
  }

  update(delta: number): void {
    super.update(delta);
  }
}
