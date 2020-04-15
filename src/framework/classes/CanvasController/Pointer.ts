import * as THREE from "three";
import autoBind from "auto-bind";
import clamp from "lodash/clamp";

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

const exitPointerLock = (
  document.exitPointerLock ||
  // @ts-ignore
  document.mozExitPointerLock
);

export default class Pointer extends CanvasController implements HasLoggerBreadcrumbs {
  readonly cursorView: ICursorCanvasView;
  readonly domElement: HTMLElement;
  readonly gameCameraController: IPerspectiveCameraController;
  readonly loadingManager: LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly pointerVector: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  readonly raycaster: THREE.Raycaster = new THREE.Raycaster();
  readonly scheduler: Scheduler;
  private _canvasHeight: number = 0;
  private _canvasOffsetLeft: number = 0;
  private _canvasOffsetTop: number = 0;
  private _canvasWidth: number = 0;
  private _cursorPlane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private _cursorPlaneIntersection: THREE.Vector3 = new THREE.Vector3();
  private _hasPointerLock: boolean = false;
  private _pointerLockX: number = 0;
  private _pointerLockY: number = 0;

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

    const optionsPassive = {
      capture: true,
      passive: true,
    };

    document.addEventListener("mozpointerlockchange", this.onPointerLockChange, optionsPassive);
    document.addEventListener("pointerlockchange", this.onPointerLockChange, optionsPassive);
    this.domElement.addEventListener("contextmenu", this.onContextMenu);
    this.domElement.addEventListener("mousedown", this.onMouseChange, optionsPassive);
    this.domElement.addEventListener("mousedown", this.onMouseDown, optionsPassive);
    this.domElement.addEventListener("mouseleave", this.onMouseLeave);
    this.domElement.addEventListener("mousemove", this.onMouseChange, optionsPassive);
    this.domElement.addEventListener("mousemove", this.onMouseMove, optionsPassive);
    this.domElement.addEventListener("mouseup", this.onMouseChange, optionsPassive);
    this.domElement.addEventListener("wheel", this.onWheel);

    await this.loadingManager.blocking(this.canvasViewBag.add(cancelToken, this.cursorView), "Loading cursor");
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    if (this._hasPointerLock) {
      exitPointerLock();
    }

    document.removeEventListener("mozpointerlockchange", this.onPointerLockChange);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    this.domElement.removeEventListener("contextmenu", this.onContextMenu);
    this.domElement.removeEventListener("mousedown", this.onMouseChange);
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mouseleave", this.onMouseLeave);
    this.domElement.removeEventListener("mousemove", this.onMouseChange);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
    this.domElement.removeEventListener("mouseup", this.onMouseChange);
    this.domElement.removeEventListener("wheel", this.onWheel);
  }

  getPointerVector(): THREE.Vector2 {
    return this.pointerVector.clone();
  }

  onContextMenu(evt: MouseEvent): void {
    evt.preventDefault();
  }

  onMouseChange(evt: MouseEvent): void {
    if (this._hasPointerLock) {
      return;
    }

    const relativeX = evt.clientX - this._canvasOffsetLeft;
    const relativeY = evt.clientY - this._canvasOffsetTop;

    this.onPointerLockPositionChange(relativeX, relativeY);
  }

  onMouseDown(evt: MouseEvent): void {
    this.domElement.requestPointerLock();
  }

  onMouseLeave(evt: MouseEvent): void {
    this.cursorView.setVisible(false);
  }

  onMouseMove(evt: MouseEvent): void {
    if (!this._hasPointerLock) {
      return;
    }

    this.onPointerLockPositionChange(this._pointerLockX + evt.movementX, this._pointerLockY + evt.movementY);
  }

  onPointerLockChange(): void {
    this._hasPointerLock = (
      document.pointerLockElement === this.domElement ||
      // @ts-ignore
      document.mozPointerLockElement === this.domElement
    );
  }

  onWheel(evt: WheelEvent): void {
    if (evt.deltaY < 0) {
      this.gameCameraController.increaseZoom(1, 5);
    } else {
      this.gameCameraController.decreaseZoom(1, 1);
    }
  }

  resize(elementSize: ElementSize<ElementPositionUnit.Px>): void {
    this._canvasHeight = elementSize.getHeight();
    this._canvasWidth = elementSize.getWidth();
  }

  setPosition(elementPosition: ElementPosition<ElementPositionUnit.Px>): void {
    super.setPosition(elementPosition);

    this._canvasOffsetLeft = elementPosition.getX();
    this._canvasOffsetTop = elementPosition.getY();
  }

  update(delta: number): void {
    this.raycaster.setFromCamera(this.pointerVector, this.gameCameraController.getCamera());

    if (!this.cursorView.isAttached()) {
      return;
    }

    this.raycaster.ray.intersectPlane(this._cursorPlane, this._cursorPlaneIntersection);
    this.cursorView.setPosition(this._cursorPlaneIntersection.x, this._cursorPlaneIntersection.y, this._cursorPlaneIntersection.z);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  private onPointerLockPositionChange(pointerLockX: number, pointerLockY: number): void {
    this._pointerLockX = clamp(pointerLockX, 0, this._canvasWidth);
    this._pointerLockY = clamp(pointerLockY, 0, this._canvasHeight);

    this.onPointerPositionChange(this._pointerLockX, this._pointerLockY);
  }

  private onPointerPositionChange(x: number, y: number): void {
    this.pointerVector.x = (x / this._canvasWidth) * 2 - 1;
    this.pointerVector.y = -1 * (y / this._canvasHeight) * 2 + 1;

    this.cursorView.setVisible(true);
    this.cursorView.setPosition(this._cursorPlaneIntersection.x, this._cursorPlaneIntersection.y, this._cursorPlaneIntersection.z);
  }
}
