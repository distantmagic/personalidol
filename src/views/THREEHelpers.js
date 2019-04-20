// @flow

import * as THREE from "three";

import type { CancelToken } from "../framework/interfaces/CancelToken";
import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { TiledMap } from "../framework/interfaces/TiledMap";

export default class THREEHelpers implements CanvasView {
  +scene: THREE.Scene;
  +tiledMap: TiledMap;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    tiledMap: TiledMap
  ) {
    this.scene = scene;
    this.tiledMap = tiledMap;
  }

  async attach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    const axesHelper = new THREE.AxesHelper(5);

    axesHelper.position.y = 0.2;

    this.scene.add(axesHelper);

    const tiledMapSize = this.tiledMap.getMapSize();
    const tiledMapEdgeMax = Math.max(
      tiledMapSize.getHeight(),
      tiledMapSize.getWidth()
    );
    const gridHelper = new THREE.GridHelper(tiledMapEdgeMax, tiledMapEdgeMax);

    gridHelper.geometry.translate(tiledMapEdgeMax / 2, 0, tiledMapEdgeMax / 2);
    gridHelper.position.y = 0.1;

    this.scene.add(gridHelper);
  }

  async detach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {}

  update(delta: number): void {}
}
