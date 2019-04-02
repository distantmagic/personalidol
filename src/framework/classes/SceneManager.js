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
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
  }

  async begin(tick: ClockTick): Promise<void> {
    this.controller.begin(tick);
  }

  async detach(): Promise<void> {
    console.log('detach');
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
    mainLoop.setUpdate(this.update);
    mainLoop.start();

    cancelToken.onCancelled(mainLoop.stop)
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
