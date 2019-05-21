// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import Cancelled from "./Exception/Cancelled";

import type { DrawCallback } from "mainloop.js";

import type { CancelToken } from "../interfaces/CancelToken";
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

  async attach(cancelToken: CancelToken, canvas: HTMLCanvasElement): Promise<void> {
    if (cancelToken.isCancelled()) {
      throw new Cancelled(this.loggerBreadcrumbs.add("attach"), "Cancel token was cancelled before attaching scene.");
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas,
      // context: canvas.getContext("webgl2"),
    });
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const drawCallback = interpolationPercentage => {
      return this.controller.draw(renderer, interpolationPercentage);
    };

    this.renderer = renderer;
    this.drawCallback = drawCallback;

    this.scheduler.onDraw(drawCallback);

    await this.controller.attach(cancelToken, renderer);
  }

  async detach(cancelToken: CancelToken): Promise<void> {
    const renderer = this.renderer;

    if (!renderer) {
      throw new Error("Renderer should be present while detaching controller.");
    }

    const drawCallback = this.drawCallback;

    if (!drawCallback) {
      throw new Error("Invalid scene lifecycle. Draw callback was expected while detaching.");
    }

    if (cancelToken.isCancelled()) {
      throw new Cancelled(this.loggerBreadcrumbs.add("detach"), "Cancel token was cancelled before detaching scene.");
    }

    this.scheduler.offDraw(drawCallback);

    await this.controller.detach(cancelToken, renderer);

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
