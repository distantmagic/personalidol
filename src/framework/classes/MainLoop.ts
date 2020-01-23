import autoBind from "auto-bind";
import noop from "lodash/noop";
import { default as VendorMainLoop } from "mainloop.js";

import Controllable from "src/framework/classes/Controllable";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as MainLoopException } from "src/framework/classes/Exception/MainLoop";

import controlled from "src/framework/decorators/controlled";

import Scheduler from "src/framework/interfaces/Scheduler";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IMainLoop } from "src/framework/interfaces/MainLoop";

import MainLoopBeginCallback from "src/framework/types/MainLoopBeginCallback";
import MainLoopDrawCallback from "src/framework/types/MainLoopDrawCallback";
import MainLoopEndCallback from "src/framework/types/MainLoopEndCallback";
import MainLoopUpdateCallback from "src/framework/types/MainLoopUpdateCallback";

let instance: null | IMainLoop = null;

export default class MainLoop implements IMainLoop {
  private readonly controllable: IControllable;

  static getInstance(loggerBreadcrumbs: ILoggerBreadcrumbs): IMainLoop {
    if (!instance) {
      throw new MainLoopException(loggerBreadcrumbs, "Main loop is used before it's instanciated.");
    }

    return instance;
  }

  constructor() {
    const loggerBreadcrumbs = new LoggerBreadcrumbs(["root", "MainLoop"]);

    if (instance) {
      throw new MainLoopException(loggerBreadcrumbs, "MainLoop is a singleton. Use `getInstance()` instead.");
    }

    autoBind(this);

    this.controllable = new Controllable(loggerBreadcrumbs);
  }

  attachScheduler(scheduler: Scheduler): void {
    this.setBegin(scheduler.notifyBegin);
    this.setDraw(scheduler.notifyDraw);
    this.setEnd(scheduler.notifyEnd);
    this.setUpdate(scheduler.notifyUpdate);
  }

  clear(): void {
    VendorMainLoop.setBegin(noop);
    VendorMainLoop.setUpdate(noop);

    this.clearDraw();
    this.clearEnd();
  }

  clearBegin(): void {
    VendorMainLoop.setBegin(noop);
  }

  clearDraw(): void {
    VendorMainLoop.setDraw(noop);
  }

  clearEnd(): void {
    VendorMainLoop.setEnd(noop);
  }

  clearUpdate(): void {
    VendorMainLoop.setUpdate(noop);
  }

  getControllable(): IControllable {
    return this.controllable;
  }

  setBegin(callback: MainLoopBeginCallback): void {
    VendorMainLoop.setBegin(callback);
  }

  setDraw(callback: MainLoopDrawCallback): void {
    VendorMainLoop.setDraw(callback);
  }

  setEnd(callback: MainLoopEndCallback): void {
    VendorMainLoop.setEnd(callback);
  }

  setMaxAllowedFPS(fps: number): void {
    VendorMainLoop.setMaxAllowedFPS(fps);
  }

  setUpdate(callback: MainLoopUpdateCallback): void {
    VendorMainLoop.setUpdate(callback);
  }

  @controlled(true)
  start(controlToken: IControlToken): void {
    VendorMainLoop.start();
  }

  @controlled(true)
  stop(controlToken: IControlToken): void {
    VendorMainLoop.stop();
  }
}

instance = new MainLoop();
