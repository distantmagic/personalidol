// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";
import Ola from "ola";

import CanvasController from "../CanvasController";

import type { Ola as OlaInterface } from "ola";
import type { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class CameraController extends CanvasController implements CameraControllerInterface {
  #lookAt: Vector3;
  +camera: PerspectiveCamera;
  +cameraPositionTween: OlaInterface<{|
    x: number,
    y: number,
    z: number,
  |}>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  zoomTarget: number;

  constructor(canvasViewBag: CanvasViewBag, camera: PerspectiveCamera, loggerBreadcrumbs: LoggerBreadcrumbs, renderer: WebGLRenderer, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.zoomTarget = 4;

    this.#lookAt = this.scene.position.clone();

    this.cameraPositionTween = Ola(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      100
    );
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

    const targetX = this.cameraPositionTween.x;
    const targetY = this.cameraPositionTween.y;
    const targetZ = this.cameraPositionTween.z;

    if (this.camera.position.x === targetX && this.camera.position.y === targetY && this.camera.position.y === targetZ) {
      return;
    }

    this.camera.position.set(targetX, targetY, targetZ);
    this.camera.lookAt(this.#lookAt);
  }

  lookAt(position: Vector3): void {
    this.#lookAt = position.clone();

    this.camera.lookAt(this.#lookAt);
    this.panCamera();
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

  panCamera(): void {
    const baseDistance = 512 / this.zoomTarget;

    this.cameraPositionTween.set({
      x: this.#lookAt.x + baseDistance,
      y: this.#lookAt.y + baseDistance * 1.6,
      z: this.#lookAt.z + baseDistance * 1.6,
    });
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    this.camera.aspect = width / height;
    this.camera.fov = 75;

    this.camera.updateProjectionMatrix();
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 5.5);

    if (this.zoomTarget === clampedZoom) {
      return;
    }

    this.zoomTarget = clampedZoom;
    this.panCamera();
  }

  useDraw(): boolean {
    return true;
  }
}
