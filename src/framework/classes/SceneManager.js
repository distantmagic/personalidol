// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import type { DrawCallback } from "mainloop.js";

import type { CanvasController } from "../interfaces/CanvasController";
import type { ElementSize } from "../interfaces/ElementSize";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";
import type { Scheduler } from "../interfaces/Scheduler";

export default class SceneManager implements SceneManagerInterface {
  +controller: CanvasController;
  +exceptionHandler: ExceptionHandler;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scheduler: Scheduler;
  drawCallback: ?DrawCallback;
  renderer: ?THREE.WebGLRenderer;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    exceptionHandler: ExceptionHandler,
    scheduler: Scheduler,
    controller: CanvasController
  ) {
    autoBind(this);

    this.controller = controller;
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.scheduler = scheduler;
  }

  async attach(canvas: HTMLCanvasElement): Promise<void> {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const drawCallback = interpolationPercentage => {
      return this.controller.draw(renderer, interpolationPercentage);
    };

    this.renderer = renderer;
    this.drawCallback = drawCallback;

    this.scheduler.onDraw(drawCallback);

    await this.controller.attach(renderer);
  }

  async detach(): Promise<void> {
    const renderer = this.renderer;

    if (!renderer) {
      throw new Error("Renderer should be present while detaching controller.");
    }

    const drawCallback = this.drawCallback;

    if (!drawCallback) {
      throw new Error(
        "Invalid scene lifecycle. Draw callback was expected while detaching."
      );
    }

    this.scheduler.offDraw(drawCallback);

    await this.controller.detach(renderer);

    this.renderer = null;
  }

  resize(elementSize: ElementSize<"px">): void {
    this.controller.resize(elementSize);

    const renderer = this.renderer;

    if (renderer) {
      renderer.setSize(elementSize.getWidth(), elementSize.getHeight());
    }
  }

  async start(): Promise<void> {
    this.scheduler.onBegin(this.controller.begin);
    this.scheduler.onEnd(this.controller.end);
    this.scheduler.onUpdate(this.controller.update);

    await this.controller.start();
  }

  async stop(): Promise<void> {
    // if scene manager is stopped, do not detach controller, but also do not
    // provide any updates
    this.scheduler.offBegin(this.controller.begin);
    this.scheduler.offEnd(this.controller.end);
    this.scheduler.offUpdate(this.controller.update);

    await this.controller.stop();
  }
}
