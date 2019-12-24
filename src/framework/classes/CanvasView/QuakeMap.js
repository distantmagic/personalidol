// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import { default as QuakeEntityView } from "./QuakeEntity";
import { default as QuakeMapQuery } from "../Query/QuakeMap";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
/* eslint-disable import/no-webpack-loader-syntax */
// $FlowFixMe
import { default as QuakeMapWorker } from "../../../workers/loader?name=QuakeMapWorker!../../../workers/exports/QuakeMap";
/* eslint-enable import/no-webpack-loader-syntax */

import type { AudioListener, AudioLoader, Group, LoadingManager as THREELoadingManager, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { Logger } from "../../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class QuakeMap extends CanvasView {
  +audioListener: AudioListener;
  +audioLoader: AudioLoader;
  +group: Group;
  +loadingManager: LoadingManager;
  +logger: Logger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +source: string;
  +threeLoadingManager: THREELoadingManager;
  quakeMapWorker: ?Worker;

  constructor(
    audioListener: AudioListener,
    audioLoader: AudioLoader,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    source: string
  ) {
    super(canvasViewBag);

    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.group = new THREE.Group();
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const quakeMapWorker: Worker = new QuakeMapWorker();

    quakeMapWorker.onmessage = function(oEvent) {
      console.log('Worker said : ', oEvent.data);
    };

    quakeMapWorker.postMessage('test');

    this.quakeMapWorker = quakeMapWorker;

    // const commands = await this.loadingManager.blocking(quakeMapWorker.loadMap(this.source), "Loading map entities");

    // const promises: Promise<void>[] = [];
    // const query = new QuakeMapQuery(this.loggerBreadcrumbs.add("QuakeMapQuery"), this.source);
    // const quakeMap = await this.queryBus.enqueue(cancelToken, query).whenExecuted();
    // let animationOffset = 0;

    // for (let entity of quakeMap.getEntities()) {
    //   const viewLoader = this.loadingManager.blocking(
    //     this.canvasViewBag.add(
    //       cancelToken,
    //       new QuakeEntityView(
    //         this.audioListener,
    //         this.audioLoader,
    //         this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeEntity")),
    //         entity,
    //         this.loadingManager,
    //         this.logger,
    //         this.loggerBreadcrumbs.add("QuakeEntity"),
    //         this.queryBus,
    //         this.group,
    //         this.threeLoadingManager,
    //         (animationOffset += 200)
    //       )
    //     ),
    //     "Loading map entity"
    //   );

    //   promises.push(viewLoader);
    // }

    // await Promise.all(promises);
    this.scene.add(this.group);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.group);

    const quakeMapWorker = this.quakeMapWorker;

    if (!quakeMapWorker) {
      return;
    }

    quakeMapWorker.terminate();
  }
}
