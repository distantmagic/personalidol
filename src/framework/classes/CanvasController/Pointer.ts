import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasController from "src/framework/classes/CanvasController";
import { default as CursorView } from "src/framework/classes/CanvasView/Cursor";

import cancelable from "src/framework/decorators/cancelable";

import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type ElementPosition from "src/framework/interfaces/ElementPosition";
import type ElementSize from "src/framework/interfaces/ElementSize";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoadingManager from "src/framework/interfaces/LoadingManager";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PointerState from "src/framework/interfaces/PointerState";
import type QueryBus from "src/framework/interfaces/QueryBus";
import type Scheduler from "src/framework/interfaces/Scheduler";
import type { default as ICursorCanvasView } from "src/framework/interfaces/CanvasView/Cursor";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";

export default class Pointer extends CanvasController implements HasLoggerBreadcrumbs {
  readonly cursorView: ICursorCanvasView;
  readonly domElement: HTMLElement;
  readonly gameCameraController: IPerspectiveCameraController;
  readonly loadingManager: LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly pointerVector: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  readonly raycaster: THREE.Raycaster = new THREE.Raycaster();
  readonly scheduler: Scheduler;
  private canvasHeight: number = 0;
  private canvasOffsetLeft: number = 0;
  private canvasOffsetTop: number = 0;
  private canvasWidth: number = 0;
  private cursorPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private cursorPlaneIntersection: THREE.Vector3 = new THREE.Vector3();

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    group: THREE.Group,
    canvasViewBag: CanvasViewBag,
    gameCameraController: IPerspectiveCameraController,
    domElement: HTMLElement,
    loadingManager: LoadingManager,
    pointerState: PointerState,
    queryBus: QueryBus,
    scheduler: Scheduler,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.gameCameraController = gameCameraController;
    this.domElement = domElement;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scheduler = scheduler;

    this.cursorView = new CursorView(
      this.loggerBreadcrumbs.add("Cursor"),
      gameCameraController,
      this.canvasViewBag.fork(this.loggerBreadcrumbs.add("Cursor")),
      loadingManager,
      group,
      pointerState,
      queryBus,
      threeLoadingManager
    );
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const domElement = this.domElement;
    const optionsPassive = {
      capture: true,
      passive: true,
    };

    domElement.addEventListener("contextmenu", this.onContextMenu);
    domElement.addEventListener("mousedown", this.onMouseChange, optionsPassive);
    domElement.addEventListener("mouseleave", this.onMouseLeave);
    domElement.addEventListener("mousemove", this.onMouseChange, optionsPassive);
    domElement.addEventListener("mouseup", this.onMouseChange, optionsPassive);
    domElement.addEventListener("wheel", this.onWheel);

    await this.loadingManager.blocking(this.canvasViewBag.add(cancelToken, this.cursorView), "Loading cursor");
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const domElement = this.domElement;

    domElement.removeEventListener("contextmenu", this.onContextMenu);
    domElement.removeEventListener("mousedown", this.onMouseChange);
    domElement.removeEventListener("mouseleave", this.onMouseLeave);
    domElement.removeEventListener("mousemove", this.onMouseChange);
    domElement.removeEventListener("mouseup", this.onMouseChange);
    domElement.removeEventListener("wheel", this.onWheel);
  }

  getPointerVector(): THREE.Vector2 {
    return this.pointerVector.clone();
  }

  onContextMenu(evt: MouseEvent): void {
    evt.preventDefault();
  }

  onMouseChange(evt: MouseEvent): void {
    const relativeX = evt.clientX - this.canvasOffsetLeft;
    const relativeY = evt.clientY - this.canvasOffsetTop;

    this.pointerVector.x = (relativeX / this.canvasWidth) * 2 - 1;
    this.pointerVector.y = -1 * (relativeY / this.canvasHeight) * 2 + 1;

    this.cursorView.setVisible(true);
    this.cursorView.setPosition(this.cursorPlaneIntersection);
  }

  onMouseLeave(evt: MouseEvent): void {
    this.cursorView.setVisible(false);
  }

  onMouseMove(evt: MouseEvent): void {}

  onWheel(evt: WheelEvent): void {
    if (evt.deltaY < 0) {
      this.gameCameraController.increaseZoom(1, 5);
    } else {
      this.gameCameraController.decreaseZoom(1, 1);
    }
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {
    this.canvasHeight = elementSize.getHeight();
    this.canvasWidth = elementSize.getWidth();
  }

  setPosition(elementPosition: ElementPosition<ElementPositionUnit.Px>): void {
    super.setPosition(elementPosition);

    this.canvasOffsetLeft = elementPosition.getX();
    this.canvasOffsetTop = elementPosition.getY();
  }

  update(delta: number): void {
    this.raycaster.setFromCamera(this.pointerVector, this.gameCameraController.getCamera());

    if (!this.cursorView.isAttached()) {
      return;
    }

    this.raycaster.ray.intersectPlane(this.cursorPlane, this.cursorPlaneIntersection);
    this.cursorView.setPosition(this.cursorPlaneIntersection);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
