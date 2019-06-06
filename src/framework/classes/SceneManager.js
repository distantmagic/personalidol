// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import Cancelled from "./Exception/Cancelled";
import EventListenerSet from "./EventListenerSet";

import type { DrawCallback } from "mainloop.js";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";
import type { ElementSize } from "../interfaces/ElementSize";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { SceneManager as SceneManagerInterface } from "../interfaces/SceneManager";
import type { SceneManagerChangeCallback } from "../types/SceneManagerChangeCallback";
import type { Scheduler } from "../interfaces/Scheduler";

export default class SceneManager implements SceneManagerInterface {
  +controller: CanvasController;
  +exceptionHandler: ExceptionHandler;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scheduler: Scheduler;
  +stateChangeCallbacks: EventListenerSetInterface<[SceneManagerInterface]>;
  _isAttached: boolean;
  _isAttaching: boolean;
  _isDetached: boolean;
  _isDetaching: boolean;
  drawCallback: ?DrawCallback;
  renderer: ?THREE.WebGLRenderer;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    exceptionHandler: ExceptionHandler,
    scheduler: Scheduler,
    controller: CanvasController
  ) {
    autoBind(this);

    this._isAttached = false;
    this._isAttaching = false;
    this._isDetached = true;
    this._isDetaching = false;
    this.controller = controller;
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.stateChangeCallbacks = new EventListenerSet<[SceneManagerInterface]>();
    this.scheduler = scheduler;
  }

  async attach(cancelToken: CancelToken, canvas: HTMLCanvasElement): Promise<void> {
    if (cancelToken.isCancelled()) {
      throw new Cancelled(this.loggerBreadcrumbs.add("attach"), "Cancel token was cancelled before attaching scene.");
    }

    this._isAttaching = true;
    this.stateChangeCallbacks.notify([this]);

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

    this._isAttaching = false;
    this._isAttached = true;
    this.stateChangeCallbacks.notify([this]);
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

    this._isDetaching = true;
    this.stateChangeCallbacks.notify([this]);

    this.scheduler.offDraw(drawCallback);

    await this.controller.detach(cancelToken, renderer);

    this.renderer = null;

    this._isDetaching = false;
    this._isDetached = false;
    this.stateChangeCallbacks.notify([this]);
  }

  isAttached(): boolean {
    return this._isAttached;
  }

  isAttaching(): boolean {
    return this._isAttaching;
  }

  isDetached(): boolean {
    return this._isDetached;
  }

  isDetaching(): boolean {
    return this._isDetaching;
  }

  onStateChange(callback: SceneManagerChangeCallback): void {
    this.stateChangeCallbacks.add(callback);
  }

  offStateChange(callback: SceneManagerChangeCallback): void {
    this.stateChangeCallbacks.delete(callback);
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
