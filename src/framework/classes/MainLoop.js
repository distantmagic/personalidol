// @flow

import autoBind from "auto-bind";
import noop from "lodash/noop";
import { default as VendorMainLoop } from "mainloop.js";

import SingletonException from "./Exception/Singleton";

import type {
  BeginCallback,
  DrawCallback,
  EndCallback,
  UpdateCallback
} from "mainloop.js";

import type { MainLoop as MainLoopInterface } from "../interfaces/MainLoop";

let instance;

export default class MainLoop implements MainLoopInterface {
  static getInstance(): MainLoop {
    return instance;
  }

  constructor() {
    if (instance) {
      throw new SingletonException(
        "MainLoop is a singleton. Use `getInstance()` instead."
      );
    }

    autoBind(this);
  }

  clear(): void {
    VendorMainLoop.setBegin(noop);
    VendorMainLoop.setUpdate(noop);

    this.clearDraw();
    this.clearEnd();
  }

  clearDraw(): void {
    VendorMainLoop.setDraw(noop);
  }

  clearEnd(): void {
    VendorMainLoop.setEnd(noop);
  }

  setBegin(callback: BeginCallback): void {
    VendorMainLoop.setBegin(callback);
  }

  setDraw(callback: DrawCallback): void {
    VendorMainLoop.setDraw(callback);
  }

  setEnd(callback: EndCallback): void {
    VendorMainLoop.setEnd(callback);
  }

  setMaxAllowedFPS(fps: number): void {
    VendorMainLoop.setMaxAllowedFPS(fps);
  }

  setUpdate(callback: UpdateCallback): void {
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
