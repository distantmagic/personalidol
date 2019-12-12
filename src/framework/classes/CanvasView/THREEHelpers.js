// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";

import type { AxesHelper, GridHelper, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class Cube extends CanvasView {
  +axesHelper: AxesHelper;
  +gridHelper: GridHelper;
  +scene: Scene;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene) {
    super(canvasViewBag);

    const gridTileSize = 32;
    const gridSideLength = 32 + 1;

    this.axesHelper = new THREE.AxesHelper(256);
    this.axesHelper.position.y = 64;

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

    disposeObject3D(this.axesHelper, true);
    disposeObject3D(this.gridHelper, true);

    this.scene.remove(this.axesHelper);
    this.scene.remove(this.gridHelper);
  }
}
