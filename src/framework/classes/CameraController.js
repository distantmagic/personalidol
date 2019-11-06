// @flow

import autoBind from "auto-bind";
import Ola from "ola";

import type { OrthographicCamera, Scene, WebGLRenderer } from "three";

import type { CameraController as CameraControllerInterface } from "../interfaces/CameraController";
import type { CameraZoomEnum } from "../types/CameraZoomEnum";
import type { Debugger } from "../interfaces/Debugger";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CameraController implements CameraControllerInterface {
  +camera: OrthographicCamera;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +renderer: WebGLRenderer;
  +scene: Scene;
  viewportSize: ElementSize<"px">;
  zoom: any;
  zoomStep: CameraZoomEnum;

  constructor(
    camera: OrthographicCamera,
    debug: Debugger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    renderer: WebGLRenderer,
    scene: Scene,
    viewportSize: ElementSize<"px">
  ) {
    autoBind(this);

    this.camera = camera;
    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.renderer = renderer;
    this.scene = scene;
    this.viewportSize = viewportSize;
    this.zoom = Ola(100, 100);
    this.zoomStep = 2;
  }

  async attach(): Promise<void> {
    this.camera.position.set(16, 16, 16);
    this.camera.lookAt(this.scene.position);
    this.updateProjection();
    this.renderer.domElement.addEventListener("wheel", this.onWheel);
    this.debug.updateState(this.loggerBreadcrumbs.add("camera").add("position"), this.camera.position);
  }

  async dispose(): Promise<void> {
    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
    this.debug.deleteState(this.loggerBreadcrumbs.add("camera").add("position"));
  }

  draw(interpolationPercentage: number): void {
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

  setViewportSize(viewportSize: ElementSize<"px">): void {
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
        this.zoom.value = 160;
        break;
      case 4:
        this.zoom.value = 320;
        break;
      case 5:
        this.zoom.value = 480;
        break;
      default:
        this.zoom.value = 100;
        break;
    }
  }

  updateProjection(): void {
    const height = this.viewportSize.getHeight();
    const width = this.viewportSize.getWidth();

    this.camera.left = -1 * (width / this.zoom.value);
    this.camera.far = 100;
    this.camera.near = 0;
    this.camera.right = width / this.zoom.value;
    this.camera.top = height / this.zoom.value;
    this.camera.bottom = -1 * (height / this.zoom.value);
    this.camera.updateProjectionMatrix();
  }
}
