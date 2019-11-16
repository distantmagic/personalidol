// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { Light, OrthographicCamera, Scene } from "three";

import type { CancelToken as CancelTokenInterface } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class AmbientLight extends CanvasView {
  +cancelToken: CancelTokenInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +light: Light<OrthographicCamera>;

  constructor(canvasViewBag: CanvasViewBag, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;

    this.light = new THREE.SpotLight<OrthographicCamera>(0xffffff);
    this.light.angle = 0.5;
    this.light.penumbra = 0.5;
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    // this one is important on mobile (ios at least)
    // https://stackoverflow.com/questions/50945270/threejs-shadow-artifact-ios-devices
    this.light.shadow.camera.near = 20;
  }

  async attach(): Promise<void> {
    await super.attach();

    this.light.position.set(240, 240, 120);
    this.scene.add(this.light);

    this.debug.updateState(this.loggerBreadcrumbs.add("light").add("position"), this.light.position);
  }

  async dispose(): Promise<void> {
    await super.dispose();

    this.scene.remove(this.light);
    this.debug.deleteState(this.loggerBreadcrumbs.add("light").add("position"));
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
