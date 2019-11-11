// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Light, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +light: Light;

  constructor(canvasViewBag: CanvasViewBag, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;

    this.light = new THREE.SpotLight(0xffffff);
    this.light.angle = 0.5;
    this.light.penumbra = 0.5;
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }

  async attach(): Promise<void> {
    await super.attach();

    this.light.position.set(240, 240, 240);
    this.debug.updateState(this.loggerBreadcrumbs.add("light").add("position"), this.light.position);
    this.scene.add(this.light);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.scene.remove(this.light);
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
