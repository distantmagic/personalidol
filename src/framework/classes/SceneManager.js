// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import MainLoop from "./MainLoop";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { ClockTick } from "../interfaces/ClockTick";
import type { ElementSize } from "../interfaces/ElementSize";
import type { HTMLElementResizeObserver } from "../interfaces/HTMLElementResizeObserver";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";

export default class SceneManager implements SceneManagerInterface {
  +controller: CanvasController;
  +htmlElementResizeObserver: HTMLElementResizeObserver;
  renderer: ?THREE.WebGLRenderer;

  constructor(controller: CanvasController) {
    autoBind(this);

    this.controller = controller;
  }

  async attach(canvas: HTMLCanvasElement): Promise<void> {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
    this.renderer = renderer;

    return this.controller.attach(renderer);
  }

  async begin(tick: ClockTick): Promise<void> {
    this.controller.begin(tick);
  }

  async detach(): Promise<void> {
    const renderer = this.renderer;

    if (!renderer) {
      throw new Error("Renderer should be present while detaching controller.");
    }

    await this.controller.detach(renderer);

    this.renderer = null;
  }

  async draw(tick: ClockTick): Promise<void> {
    const renderer = this.renderer;

    if (renderer) {
      this.controller.draw(renderer, tick);
    }
  }

  async end(tick: ClockTick): Promise<void> {
    const renderer = this.renderer;

    if (renderer) {
      this.controller.end(renderer, tick);
    }
  }

  async loop(cancelToken: CancelToken): Promise<void> {
    const mainLoop = MainLoop.getInstance();

    mainLoop.setDraw(this.draw);
    console.log("loop.setUpdate");
    mainLoop.setUpdate(this.update);
    mainLoop.start();

    // cancelToken.onCancelled(mainLoop.stop);
  }

  async resize(elementSize: ElementSize): Promise<void> {
    this.controller.resize(elementSize);

    const renderer = this.renderer;

    if (renderer) {
      renderer.setSize(elementSize.getWidth(), elementSize.getHeight());
    }
  }

  async update(tick: ClockTick): Promise<void> {
    this.controller.update(tick);
  }
}
