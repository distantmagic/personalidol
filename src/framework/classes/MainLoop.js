// @flow

import autoBind from "auto-bind";
import noop from "lodash/noop";
import { default as VendorMainLoop } from "mainloop.js";

import SingletonException from "./Exception/Singleton";

import type { AnimateCallback } from "mainloop.js";

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

  setBegin(callback: AnimateCallback): void {
    VendorMainLoop.setBegin(callback);
  }

  setDraw(callback: AnimateCallback): void {
    VendorMainLoop.setDraw(callback);
  }

  setEnd(callback: AnimateCallback): void {
    VendorMainLoop.setEnd(callback);
  }

  setUpdate(callback: AnimateCallback): void {
    VendorMainLoop.setUpdate(callback);
  }

  start(): void {
    VendorMainLoop.setMaxAllowedFPS(10);
    VendorMainLoop.start();
  }

  stop(): void {
    VendorMainLoop.stop();
  }
}

// https://11xnewride.com/tutorials/javascript/how-to-make-javascript-singleton
instance = new MainLoop();
