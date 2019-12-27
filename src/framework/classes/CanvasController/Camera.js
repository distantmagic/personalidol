// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";
import Ola from "ola";

import CanvasController from "../CanvasController";

import type { Ola as OlaInterface } from "ola";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class CameraController extends CanvasController implements CameraControllerInterface {
  +camera: PerspectiveCamera;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  +zoomTween: OlaInterface;
  zoomTarget: number;

  constructor(canvasViewBag: CanvasViewBag, camera: PerspectiveCamera, loggerBreadcrumbs: LoggerBreadcrumbs, renderer: WebGLRenderer, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.zoomTarget = 4;
    this.zoomTween = Ola(this.zoomTarget, 100);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    this.lookAt(new THREE.Vector3(256 * 3, 0, 256 * 2));
    this.renderer.domElement.addEventListener("wheel", this.onWheel);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);

    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
  }

  draw(interpolationPercentage: number): void {
    super.draw(interpolationPercentage);

    if (this.camera.zoom === this.zoomTarget) {
      return;
    }

    this.camera.zoom = this.zoomTween.value;
    this.camera.updateProjectionMatrix();
  }

  lookAt(position: Vector3): void {
    const cameraPosition = position.clone();

    cameraPosition.x += 512;
    cameraPosition.y += 512 * 1.3;
    cameraPosition.z += 512 * 1.3;

    this.camera.position.copy(cameraPosition);
    this.camera.far = this.camera.position.distanceTo(this.scene.position);
    this.camera.near = 1;
    this.camera.lookAt(position);
    this.camera.updateProjectionMatrix();
  }

  onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    const delta = evt.deltaY > 0 ? 3 : -3;
    const adjustedZoom = this.zoomTarget - delta;

    this.setZoom(adjustedZoom);
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    this.camera.aspect = width / height;
    this.camera.fov = 120;

    this.camera.updateProjectionMatrix();
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 2, 8);

    if (this.zoomTarget === clampedZoom) {
      return;
    }

    this.zoomTarget = clampedZoom;
    this.zoomTween.value = clampedZoom;
  }

  useDraw(): boolean {
    return true;
  }
}
