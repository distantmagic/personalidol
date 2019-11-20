// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import { default as QuakeEntityView } from "./QuakeEntity";
import { default as QuakeMapQuery } from "../Query/QuakeMap";

import type { AudioListener, AudioLoader, LoadingManager as THREELoadingManager, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class QuakeMap extends CanvasView {
  +audioListener: AudioListener;
  +audioLoader: AudioLoader;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +source: string;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    audioListener: AudioListener,
    audioLoader: AudioLoader,
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

    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const promises: Promise<any>[] = [];
    const query = new QuakeMapQuery(this.loggerBreadcrumbs.add("QuakeMapQuery"), this.source);
    const quakeMap = await this.queryBus.enqueue(cancelToken, query);

    for (let entity of quakeMap.getEntities()) {
      const viewLoader = this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new QuakeEntityView(
            this.audioListener,
            this.audioLoader,
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeMap")),
            entity,
            this.loadingManager,
            this.loggerBreadcrumbs.add("QuakeMap"),
            this.queryBus,
            this.scene,
            this.threeLoadingManager
          )
        ),
        "Loading map entity"
      );

      promises.push(viewLoader);
    }

    await Promise.all(promises);
  }
}
