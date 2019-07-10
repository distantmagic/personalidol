// @flow

import * as THREE from "three";

import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import TiledMapEllipsesView from "./TiledMapEllipsesView";
import TiledMapRectanglesView from "./TiledMapRectanglesView";

import type { Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { TiledMap } from "../../framework/interfaces/TiledMap";

export default class TiledMapObjectsView implements CanvasView {
  +canvasViewGroup: CanvasViewGroupInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  +tiledMap: TiledMap;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    tiledMap: TiledMap
  ) {
    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs.add("CanvasViewGroup"));
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.tiledMap = tiledMap;
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    this.canvasViewGroup.add(
      new TiledMapEllipsesView(this.loggerBreadcrumbs.add("TiledMapEllipsesView"), this.scene, this.tiledMap)
    );
    this.canvasViewGroup.add(
      new TiledMapRectanglesView(
        this.loggerBreadcrumbs.add("TiledMapEllipsesView"),
        this.queryBus,
        this.scene,
        this.threeLoadingManager,
        this.tiledMap
      )
    );

    await this.canvasViewGroup.attach(cancelToken, renderer);
  }

  begin(): void {
    return this.canvasViewGroup.begin();
  }

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.detach(cancelToken, renderer);
  }

  async start(): Promise<void> {
    await this.canvasViewGroup.start();
  }

  async stop(): Promise<void> {
    await this.canvasViewGroup.stop();
  }

  update(delta: number): void {
    this.canvasViewGroup.update(delta);
  }
}
