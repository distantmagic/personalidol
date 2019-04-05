// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { ElementSize } from "../interfaces/ElementSize";
import type { MainLoop } from "../interfaces/MainLoop";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";

export default class SceneManager implements SceneManagerInterface {
  +controller: CanvasController;
  +mainLoop: MainLoop;
  renderer: ?THREE.WebGLRenderer;

  constructor(mainLoop: MainLoop, controller: CanvasController) {
    autoBind(this);

    this.controller = controller;
    this.mainLoop = mainLoop;
  }

  async attach(canvas: HTMLCanvasElement): Promise<void> {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
    this.renderer = renderer;

    this.mainLoop.setDraw(this.controller.draw.bind(this.controller, renderer));
    this.mainLoop.setEnd(this.controller.end.bind(this.controller, renderer));

    return this.controller.attach(renderer);
  }

  async detach(): Promise<void> {
    const renderer = this.renderer;

    if (!renderer) {
      throw new Error("Renderer should be present while detaching controller.");
    }

    this.mainLoop.clearDraw();
    this.mainLoop.clearEnd();

    await this.controller.detach(renderer);

    this.renderer = null;
  }

  async loop(cancelToken: CancelToken): Promise<void> {
    if (cancelToken.isCancelled()) {
      return;
    }

    this.mainLoop.setBegin(this.controller.begin);
    this.mainLoop.setUpdate(this.controller.update);

    cancelToken.onCancelled(this.mainLoop.clear);
  }

  resize(elementSize: ElementSize): void {
    this.controller.resize(elementSize);

    const renderer = this.renderer;

    if (renderer) {
      renderer.setSize(elementSize.getWidth(), elementSize.getHeight());
    }
  }
}
