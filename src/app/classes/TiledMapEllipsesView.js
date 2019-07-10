// @flow

import * as THREE from "three";

import type { Scene } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasView } from "../../framework/interfaces/CanvasView";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { TiledMap } from "../../framework/interfaces/TiledMap";

export default class TiledMapEllipsesView implements CanvasView {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +tiledMap: TiledMap;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, scene: Scene, tiledMap: TiledMap) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scene = scene;
    this.tiledMap = tiledMap;
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  begin(): void {}

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {}
}
