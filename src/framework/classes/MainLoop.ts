import autoBind from "auto-bind";
import noop from "lodash/noop";
import { default as VendorMainLoop } from "mainloop.js";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as MainLoopException } from "src/framework/classes/Exception/MainLoop";

import Scheduler from "src/framework/interfaces/Scheduler";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IMainLoop } from "src/framework/interfaces/MainLoop";

import MainLoopBeginCallback from "src/framework/types/MainLoopBeginCallback";
import MainLoopDrawCallback from "src/framework/types/MainLoopDrawCallback";
import MainLoopEndCallback from "src/framework/types/MainLoopEndCallback";
import MainLoopUpdateCallback from "src/framework/types/MainLoopUpdateCallback";

let instance: null | IMainLoop = null;

export default class MainLoop implements IMainLoop {
  static getInstance(loggerBreadcrumbs: ILoggerBreadcrumbs): MainLoop {
    if (!instance) {
      throw new MainLoopException(loggerBreadcrumbs, "Main loop is used before it's instanciated.");
    }

    return instance;
  }

  constructor() {
    if (instance) {
      throw new MainLoopException(new LoggerBreadcrumbs(["root", "MainLoop"]), "MainLoop is a singleton. Use `getInstance()` instead.");
    }

    autoBind(this);
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

  start(): void {
    VendorMainLoop.start();
  }

  stop(): void {
    VendorMainLoop.stop();
  }
}

instance = new MainLoop();
