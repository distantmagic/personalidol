// @flow

import * as THREE from "three";

import CanvasViewGroup from "../framework/classes/CanvasViewGroup";
import GameboardTileset from "./GameboardTileset";
import GameboardTiledObjects from "./GameboardTiledObjects";

import type { CancelToken } from "../framework/interfaces/CancelToken";
import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../framework/interfaces/CanvasViewGroup";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../framework/interfaces/PointerState";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";
import type { THREEPointerInteraction } from "../framework/interfaces/THREEPointerInteraction";
import type { TiledMap } from "../framework/interfaces/TiledMap";

export default class Gameboard implements CanvasView {
  +canvasViewGroup: CanvasViewGroupInterface;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +pointerState: PointerState;
  +scene: THREE.Scene;
  +threeLoadingManager: THREELoadingManager;
  +threePointerInteraction: THREEPointerInteraction;
  +tiledMap: TiledMap;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    pointerState: PointerState,
    threeLoadingManager: THREELoadingManager,
    threePointerInteraction: THREEPointerInteraction,
    tiledMap: TiledMap
  ) {
    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs);
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.pointerState = pointerState;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
    this.threePointerInteraction = threePointerInteraction;
    this.tiledMap = tiledMap;
  }

  async attach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    this.canvasViewGroup.add(
      new GameboardTileset(
        this.scene,
        this.pointerState,
        this.tiledMap,
        this.threeLoadingManager,
        this.threePointerInteraction
      )
    );

    this.canvasViewGroup.add(
      new GameboardTiledObjects(
        this.scene,
        this.threeLoadingManager,
        this.tiledMap
      )
    );

    return this.canvasViewGroup.attach(cancelToken, renderer);
  }

  async detach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    return this.canvasViewGroup.detach(cancelToken, renderer);
  }

  async start(): Promise<void> {
    return this.canvasViewGroup.start();
  }

  async stop(): Promise<void> {
    return this.canvasViewGroup.stop();
  }

  begin(): void {
    this.canvasViewGroup.begin();
  }

  update(delta: number): void {
    this.canvasViewGroup.update(delta);
  }
}
