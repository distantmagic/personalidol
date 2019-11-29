// @flow

import autoBind from "auto-bind";
import Ola from "ola";

import CanvasController from "../CanvasController";

import type { OrthographicCamera, Scene, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../../interfaces/CameraController";
import type { CameraZoomEnum } from "../../types/CameraZoomEnum";
import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { Debugger } from "../../interfaces/Debugger";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

const ZOOM_2 = 4;
const ZOOM_3 = 8;
const ZOOM_4 = 16;
const ZOOM_5 = 32;

export default class CameraController extends CanvasController implements CameraControllerInterface {
  +camera: OrthographicCamera;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  viewportSize: ElementSize<"px">;
  zoom: any;
  zoomStep: CameraZoomEnum;

  constructor(
    canvasViewBag: CanvasViewBag,
    camera: OrthographicCamera,
    debug: Debugger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    renderer: WebGLRenderer,
    scene: Scene,
    viewportSize: ElementSize<"px">
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.camera = camera;
    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.viewportSize = viewportSize;
    this.zoom = Ola(ZOOM_2, 100);
    this.zoomStep = 2;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    super.attach(cancelToken);

    this.camera.position.set(128, 128, 128);
    this.camera.lookAt(this.scene.position);
    this.updateProjection();
    this.renderer.domElement.addEventListener("wheel", this.onWheel);
    this.debug.updateState(this.loggerBreadcrumbs.add("camera").add("position"), this.camera.position);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    super.dispose(cancelToken);

    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
    this.debug.deleteState(this.loggerBreadcrumbs.add("camera").add("position"));
  }

  draw(interpolationPercentage: number): void {
    super.draw(interpolationPercentage);

    this.updateProjection();
  }

  onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    const delta = evt.deltaY > 0 ? 1 : -1;
    const adjustedZoomStep = this.zoomStep - delta;

    // this switch is mostly for flowjs typechecking
    switch (adjustedZoomStep) {
      case 2:
      case 3:
      case 4:
      case 5:
        this.setZoomStep(adjustedZoomStep);
        return;
      default:
        if (adjustedZoomStep > 5) {
          this.setZoomStep(5);
        } else {
          this.setZoomStep(2);
        }
        break;
    }
  }

  resize(viewportSize: ElementSize<"px">): void {
    super.resize(viewportSize);

    this.viewportSize = viewportSize;
    this.updateProjection();
  }

  setZoomStep(zoomStep: CameraZoomEnum): void {
    if (this.zoomStep === zoomStep) {
      return;
    }

    this.zoomStep = zoomStep;

    switch (this.zoomStep) {
      case 3:
        this.zoom.value = ZOOM_3;
        break;
      case 4:
        this.zoom.value = ZOOM_4;
        break;
      case 5:
        this.zoom.value = ZOOM_5;
        break;
      default:
        this.zoom.value = ZOOM_2;
        break;
    }
  }

  updateProjection(): void {
    const height = this.viewportSize.getHeight();
    const width = this.viewportSize.getWidth();

    this.camera.left = -1 * (width / this.zoom.value);
    this.camera.far = 1024;
    this.camera.near = -512;
    this.camera.right = width / this.zoom.value;
    this.camera.top = height / this.zoom.value;
    this.camera.bottom = -1 * (height / this.zoom.value);
    this.camera.updateProjectionMatrix();
  }
}
