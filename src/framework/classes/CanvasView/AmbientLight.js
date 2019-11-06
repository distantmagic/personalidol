// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Scene, AmbientLight as AmbientLightInterface } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +spotLight: AmbientLightInterface;

  constructor(canvasViewBag: CanvasViewBag, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.spotLight = new THREE.AmbientLight(0xffffff, 4);
  }

  async attach(): Promise<void> {
    await super.attach();

    this.spotLight.position.set(32, 32, 32);
    this.debug.updateState(this.loggerBreadcrumbs.add("light").add("position"), this.spotLight.position);
    this.scene.add(this.spotLight);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.scene.remove(this.spotLight);
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
