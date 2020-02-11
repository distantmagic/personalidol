import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasController from "src/framework/classes/CanvasController";
import { default as MD2CharacterView } from "src/framework/classes/CanvasView/MD2Character";

import PointerButtonNames from "src/framework/enums/PointerButtonNames";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import PointerState from "src/framework/interfaces/PointerState";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as ICameraController } from "src/framework/interfaces/CanvasController/Camera";
import { default as IMD2CharacterView } from "src/framework/interfaces/CanvasView/MD2Character";
import { default as IPointerController } from "src/framework/interfaces/CanvasController/Pointer";

import QuakeWorkerPlayer from "src/framework/types/QuakeWorkerPlayer";

const SPEED_UNITS_PER_SECOND = 300;

export default class Player extends CanvasController implements HasLoggerBreadcrumbs {
  readonly cameraController: ICameraController;
  readonly entity: QuakeWorkerPlayer;
  readonly loadingManager: LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly playerView: IMD2CharacterView;
  readonly pointerController: IPointerController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  readonly threeLoadingManager: THREE.LoadingManager;
  private pointerVectorRotationPivot: THREE.Vector2 = new THREE.Vector2(0, 0);
  private zeroVelocityVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    cameraController: ICameraController,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    entity: QuakeWorkerPlayer,
    loadingManager: LoadingManager,
    pointerController: IPointerController,
    pointerState: PointerState,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.cameraController = cameraController;
    this.entity = entity;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.pointerController = pointerController;
    this.pointerState = pointerState;
    this.queryBus = queryBus;
    this.threeLoadingManager = threeLoadingManager;

    this.playerView = new MD2CharacterView(
      this.loggerBreadcrumbs.add("MD2Character"),
      this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
      group,
      this.queryBus,
      this.threeLoadingManager,
      `/models/model-md2-necron99/`,
      0,
      {
        angle: 0,
        classname: "model_md2",
        model_name: "necron99",
        origin: this.entity.origin,
        skin: 4,
      }
    );
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.cameraController.lookAt(new THREE.Vector3().fromArray(this.entity.origin));

    await this.loadingManager.blocking(this.canvasViewBag.add(cancelToken, this.playerView), "Loading player view");
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }

  setIdle(): void {
    this.playerView.setAnimationIdle();
    // this.playerView.setVelocity(this.zeroVelocityVector);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  update(delta: number): void {
    super.update(delta);

    if (!this.pointerState.isPressed(PointerButtonNames.Primary)) {
      return void this.setIdle();
    }

    const pointerVector = this.pointerController.getPointerVector();

    pointerVector.rotateAround(this.pointerVectorRotationPivot, (3 * Math.PI) / 4);

    if (pointerVector.length() < 0.1) {
      return void this.setIdle();
    }

    const direction = new THREE.Vector3(pointerVector.y, 0, pointerVector.x).normalize().multiplyScalar(delta * SPEED_UNITS_PER_SECOND);

    this.playerView.setAnimationRunning();
    this.playerView.setRotationY(pointerVector.angle());
    this.playerView.setVelocity(direction);

    this.cameraController.lookAt(this.playerView.getPosition());
  }
}
