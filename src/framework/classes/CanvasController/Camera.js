// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";
import Ola from "ola";

import CanvasController from "../CanvasController";

import type { Ola as OlaInterface } from "ola";
import type { OrthographicCamera, Scene, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class CameraController extends CanvasController implements CameraControllerInterface {
  +camera: OrthographicCamera;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  +zoomTween: OlaInterface;
  zoomTarget: number;

  constructor(canvasViewBag: CanvasViewBag, camera: OrthographicCamera, loggerBreadcrumbs: LoggerBreadcrumbs, renderer: WebGLRenderer, scene: Scene) {
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

    // this.lookAt(this.scene.position);
    this.lookAt(new THREE.Vector3(256, 0, 256));

    this.camera.updateProjectionMatrix();

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
    const cameraPosition = position.clone().addScalar(512 + 256);

    this.camera.position.copy(cameraPosition);
    this.camera.lookAt(position);
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

    this.camera.left = -1 * width;
    this.camera.far = 2048;
    this.camera.near = 0;
    this.camera.right = width;
    this.camera.top = height;
    this.camera.bottom = -1 * height;

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
