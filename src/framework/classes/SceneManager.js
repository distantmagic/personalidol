// @flow

import * as THREE from "three";

import frameinterval from "../../framework/helpers/frameinterval";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { ElementSize } from "../interfaces/ElementSize";
import type { HTMLElementResizeObserver } from "../interfaces/HTMLElementResizeObserver";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";

export default class SceneManager implements SceneManagerInterface {
  +controller: CanvasController;
  +htmlElementResizeObserver: HTMLElementResizeObserver;
  renderer: ?THREE.WebGLRenderer;

  constructor(controller: CanvasController) {
    this.controller = controller;
  }

  async attach(canvas: HTMLCanvasElement): Promise<void> {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
  }

  async resize(elementSize: ElementSize): Promise<void> {
    this.controller.resize(elementSize);

    const renderer = this.renderer;

    if (renderer) {
      renderer.setSize(elementSize.getWidth(), elementSize.getHeight());
    }
  }

  async loop(cancelToken: CancelToken): Promise<void> {
    for await (let tick of frameinterval(cancelToken)) {
      if (this.renderer) {
        await this.controller.tick(this.renderer, tick);
      }
    }
  }
}
