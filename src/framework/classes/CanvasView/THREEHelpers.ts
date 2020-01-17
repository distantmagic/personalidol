import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default class THREEHelpers extends CanvasView {
  readonly axesHelper: THREE.AxesHelper;
  readonly gridHelper: THREE.GridHelper;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: CanvasViewBag, group: THREE.Group) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    const gridTileSize = 32;
    const gridSideLength = 32 + 1;

    this.axesHelper = new THREE.AxesHelper(256);
    this.gridHelper = new THREE.GridHelper(gridSideLength * gridTileSize, gridSideLength);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    this.axesHelper.position.y = 64;

    this.children.add(this.axesHelper);
    this.children.add(this.gridHelper);
  }

  getName(): "THREEHelpers" {
    return "THREEHelpers";
  }
}
