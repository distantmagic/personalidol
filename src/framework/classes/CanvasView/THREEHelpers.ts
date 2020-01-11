// @flow strict

import * as THREE from "three";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";

import type { AxesHelper, GridHelper, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class THREEHelpers extends CanvasView {
  +scene: Scene;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene) {
    super(canvasViewBag);

    this.scene = scene;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const gridTileSize = 32;
    const gridSideLength = 32 + 1;

    const axesHelper = new THREE.AxesHelper(256);

    axesHelper.position.y = 64;

    const gridHelper = new THREE.GridHelper(gridSideLength * gridTileSize, gridSideLength);

    this.children.add(axesHelper);
    this.children.add(gridHelper);

    this.scene.add(this.children);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.children);
  }
}
