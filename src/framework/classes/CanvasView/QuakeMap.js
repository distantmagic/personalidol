// @flow

import autoBind from "auto-bind";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

import CanvasView from "../CanvasView";

import type { LoadingManager as THREELoadingManager, Scene } from "three";
import type { OBJLoader2 as OBJLoader2Interface } from "three/examples/jsm/loaders/OBJLoader2";

import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class QuakeMap extends CanvasView {
  +objLoader2Parallel: OBJLoader2Interface;
  +scene: Scene;
  +source: string;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene, threeLoadingManager: THREELoadingManager, source: string) {
    super(canvasViewBag);
    autoBind(this);

    this.objLoader2Parallel = new OBJLoader2(threeLoadingManager);
    this.scene = scene;
    this.source = source;
  }

  async attach(): Promise<void> {
    await super.attach();

    return new Promise((resolve, reject) => {
      this.objLoader2Parallel.load(
        this.source,
        object => {
          object.scale.set(0.02, 0.02, 0.02);

          this.scene.add(object);
          resolve();
        },
        null,
        reject,
        null
      );
    });
  }

  async dispose(): Promise<void> {
    await super.dispose();
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }

  useUpdate(): boolean {
    return super.useUpdate() && false;
  }
}
