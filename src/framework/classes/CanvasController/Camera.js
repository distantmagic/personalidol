// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";
import yn from "yn";

import CanvasController from "../CanvasController";
import env from "../../helpers/env";

import type { OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class CameraController extends CanvasController implements CameraControllerInterface {
  #lookAt: Vector3;
  +camera: OrthographicCamera;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  height: number;
  width: number;
  zoomTarget: number;

  constructor(canvasViewBag: CanvasViewBag, camera: OrthographicCamera, debug: Debugger, loggerBreadcrumbs: LoggerBreadcrumbs, renderer: WebGLRenderer, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.debug = debug;
    this.height = 0;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.width = 0;
    this.zoomTarget = 1;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    this.camera.far = 4096;
    // this.lookAt(new THREE.Vector3(256 * 2, 0, 256 * 2));
    this.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.domElement.addEventListener("wheel", this.onWheel);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);

    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
  }

  end(fps: number, isPanicked: boolean): void {
    super.end(fps, isPanicked);

    this.debug.updateState(this.loggerBreadcrumbs.add("position"), this.camera.position);
  }

  lookAt(position: Vector3): void {
    const baseDistance = 256 * 3;

    // prettier-ignore
    this.camera.position.set(
      position.x + baseDistance,
      position.y + baseDistance,
      position.z + baseDistance
    );

    this.camera.lookAt(position.clone());
    this.updateProjectionMatrix();
  }

  onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    const delta: number = evt.deltaY > 0 ? 1 : -1;
    const adjustedZoom = this.zoomTarget - delta;

    this.setZoom(adjustedZoom);
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    const height = viewportSize.getHeight();
    const width = viewportSize.getWidth();

    if (this.height === height && this.width === width) {
      return;
    }

    this.height = height;
    this.width = width;

    this.updateProjectionMatrix();
  }

  setZoom(zoom: number): void {
    const clampedZoom = clamp(zoom, 1, 5.5);

    if (this.zoomTarget === clampedZoom) {
      return;
    }

    this.zoomTarget = clampedZoom;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    this.camera.left = -1 * (this.width / this.zoomTarget);
    this.camera.right = this.width / this.zoomTarget;
    this.camera.top = this.height / this.zoomTarget;
    this.camera.bottom = -1 * (this.height / this.zoomTarget);
    this.camera.updateProjectionMatrix();

    // const frustum = new THREE.Frustum();
    // frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) );
    // console.log(frustum);
  }

  useEnd(): boolean {
    return yn(env(this.loggerBreadcrumbs.add("useEnd"), "REACT_APP_FEATURE_DEBUGGER", ""), {
      default: false,
    });
  }
}
