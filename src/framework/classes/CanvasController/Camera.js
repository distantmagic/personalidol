// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";
import yn from "yn";

import CanvasController from "../CanvasController";
import env from "../../helpers/env";

import type { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class CameraController extends CanvasController implements CameraControllerInterface {
  #lookAt: Vector3;
  +camera: PerspectiveCamera;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  zoomTarget: number;

  constructor(canvasViewBag: CanvasViewBag, camera: PerspectiveCamera, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, renderer: WebGLRenderer, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.zoomTarget = 1;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    this.camera.far = 4096;
    this.lookAt(new THREE.Vector3(256 * 1, 0, 256 * 1));

    this.renderer.domElement.addEventListener("wheel", this.onWheel);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);

    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
  }

  end(fps: number, isPanicked: boolean): void {
    super.end(fps, isPanicked);

    this.debug.updateState(this.loggerBreadcrumbs.add("aspect"), this.camera.aspect);
    this.debug.updateState(this.loggerBreadcrumbs.add("position"), this.camera.position);
  }

  lookAt(position: Vector3): void {
    const baseDistance = (256 * 3) / this.zoomTarget;

    this.camera.position.set(position.x + baseDistance, position.y + baseDistance * 1.6, position.z + baseDistance * 1.6);
    this.camera.lookAt(position.clone());
    this.camera.updateProjectionMatrix();
  }

  onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    let delta = evt.deltaY > 0 ? 1 : -1;

    if (this.zoomTarget < 4) {
      delta *= 0.5;
    }

    const adjustedZoom = this.zoomTarget - delta;

    this.setZoom(adjustedZoom);
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 5.5);

    if (this.zoomTarget === clampedZoom) {
      return;
    }

    this.zoomTarget = clampedZoom;
    this.lookAt(new THREE.Vector3(256 * 1, 0, 256 * 1));
  }

  useEnd(): boolean {
    return yn(env(this.loggerBreadcrumbs.add("useEnd").add("env"), "REACT_APP_FEATURE_DEBUGGER", ""), {
      default: false,
    });
  }
}
