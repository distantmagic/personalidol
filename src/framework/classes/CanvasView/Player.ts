// import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { QuakeWorkerPlayer } from "src/framework/types/QuakeWorkerPlayer";

export default class Player extends CanvasView {
  constructor(canvasViewBag: CanvasViewBag, group: THREE.Group, entity: QuakeWorkerPlayer) {
    super(canvasViewBag, group);
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    console.log("ATTACH PLAYER");
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);
  }
}
