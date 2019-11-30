// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";

import type { AxesHelper, GridHelper, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class Cube extends CanvasView {
  +axesHelper: AxesHelper;
  +gridHelper: GridHelper;
  +scene: Scene;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    const gridTileSize = 32;
    const gridSideLength = 32 + 1;

    this.axesHelper = new THREE.AxesHelper(256);
    this.gridHelper = new THREE.GridHelper(gridSideLength * gridTileSize, gridSideLength);
    this.scene = scene;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.scene.add(this.axesHelper);
    this.scene.add(this.gridHelper);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.axesHelper);
    this.scene.remove(this.gridHelper);
  }
}
