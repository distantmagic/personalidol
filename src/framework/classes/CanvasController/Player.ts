import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasController from "src/framework/classes/CanvasController";
import { default as MD2CharacterView } from "src/framework/classes/CanvasView/MD2Character";

import cancelable from "src/framework/decorators/cancelable";

import PointerButtonNames from "src/framework/enums/PointerButtonNames";
import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoadingManager from "src/framework/interfaces/LoadingManager";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PointerState from "src/framework/interfaces/PointerState";
import type QueryBus from "src/framework/interfaces/QueryBus";
import type { default as IMD2CharacterView } from "src/framework/interfaces/CanvasView/MD2Character";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";
import type { default as IPointerController } from "src/framework/interfaces/CanvasController/Pointer";

import type QuakeWorkerPlayer from "src/framework/types/QuakeWorkerPlayer";

const SPEED_UNITS_PER_SECOND = 20000;

export default class Player extends CanvasController implements HasLoggerBreadcrumbs {
  readonly entity: QuakeWorkerPlayer;
  readonly gameCameraController: IPerspectiveCameraController;
  readonly loadingManager: LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly playerView: IMD2CharacterView;
  readonly pointerController: IPointerController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  readonly threeLoadingManager: THREE.LoadingManager;
  private _pointerVectorRotationPivot: THREE.Vector2 = new THREE.Vector2(0, 0);
  private _playerRotationEuler: THREE.Euler = new THREE.Euler();
  private _playerRotationQuaternion: THREE.Quaternion = new THREE.Quaternion();
  private _zeroVelocityVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    gameCameraController: IPerspectiveCameraController,
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

    this.gameCameraController = gameCameraController;
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
      `/models/model-md2-ratamahatta/`,
      0,
      {
        angle: 0,
        classname: "model_md2",
        model_name: "ratamahatta",
        origin: this.entity.origin,
        skin: 0,
      }
    );
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);
    await this.loadingManager.blocking(this.canvasViewBag.add(cancelToken, this.playerView), "Loading player view");

    this.gameCameraController.follow(this.playerView);
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.gameCameraController.unfollow(this.playerView);
  }

  setIdle(): void {
    this.playerView.setAnimationIdle();
    this.playerView.setVelocity(this._zeroVelocityVector);
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }

  update(delta: number): void {
    if (!this.pointerState.isPressed(PointerButtonNames.Primary)) {
      return void this.setIdle();
    }

    const pointerVector = this.pointerController.getPointerVector();
    const pointerVectorLength = pointerVector.length();

    if (pointerVectorLength < 0.02) {
      return void this.setIdle();
    }

    pointerVector.rotateAround(this._pointerVectorRotationPivot, (3 * Math.PI) / 4);

    const velocity = new THREE.Vector3(pointerVector.y, 0, pointerVector.x).normalize().multiplyScalar(delta * SPEED_UNITS_PER_SECOND);

    this._playerRotationEuler.set(0, pointerVector.angle(), 0);
    this._playerRotationQuaternion.setFromEuler(this._playerRotationEuler);

    if (pointerVectorLength < 0.1) {
      velocity.multiplyScalar(pointerVectorLength * 10);
    }

    this.playerView.setAnimationRunning();
    this.playerView.setRotation(this._playerRotationQuaternion);
    this.playerView.setVelocity(velocity);

    this.gameCameraController.lookAtFromDistance(this.playerView.getPosition(), 256 * 4);
  }
}
