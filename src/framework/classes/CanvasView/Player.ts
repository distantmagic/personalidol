// import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";
import { default as MD2CharacterView } from "src/framework/classes/CanvasView/MD2Character";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as IMD2CharacterView } from "src/framework/interfaces/CanvasView/MD2Character";

import QuakeWorkerPlayer from "src/framework/types/QuakeWorkerPlayer";

export default class Player extends CanvasView {
  readonly entity: QuakeWorkerPlayer;
  readonly loadingManager: LoadingManager;
  readonly md2CharacterView: IMD2CharacterView;
  readonly queryBus: QueryBus;
  readonly threeLoadingManager: THREE.LoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    entity: QuakeWorkerPlayer,
    loadingManager: LoadingManager,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.entity = entity;
    this.loadingManager = loadingManager;
    this.queryBus = queryBus;
    this.threeLoadingManager = threeLoadingManager;

    this.md2CharacterView = new MD2CharacterView(
      this.loggerBreadcrumbs.add("MD2Character"),
      this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
      this.children,
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

    await this.loadingManager.blocking(this.canvasViewBag.add(cancelToken, this.md2CharacterView), "Loading MD2 model");
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }

  getCharacter(): IMD2CharacterView {
    return this.md2CharacterView;
  }

  getName(): "Player" {
    return "Player";
  }
}
