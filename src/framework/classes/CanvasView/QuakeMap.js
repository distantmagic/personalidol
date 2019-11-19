// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import { default as QuakeEntityView } from "./QuakeEntity";
import { default as QuakeMapQuery } from "../Query/QuakeMap";

import type { LoadingManager as THREELoadingManager, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class QuakeMap extends CanvasView {
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +source: string;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    source: string
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const query = new QuakeMapQuery(this.loggerBreadcrumbs.add("QuakeMapQuery"), this.source);
    const quakeMap = await this.queryBus.enqueue(cancelToken, query);

    for (let entity of quakeMap.getEntities()) {
      await this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new QuakeEntityView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
            entity,
            this.loadingManager,
            this.loggerBreadcrumbs.add("QuakeMap"),
            this.scene,
            this.threeLoadingManager
          )
        ),
        "Loading map entity"
      );
    }
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
