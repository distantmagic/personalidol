// @flow

import autoBind from "auto-bind";
import noop from "lodash/noop";
import { default as VendorMainLoop } from "mainloop.js";

import RequestAnimationFrameTick from "./RequestAnimationFrameTick";
import SingletonException from "./Exception/Singleton";

import type { MainLoop as MainLoopInterface } from "../interfaces/MainLoop";
import type { MainLoopTickCallback } from "../interfaces/MainLoopTickCallback";

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

  setBegin(callback: MainLoopTickCallback): void {
    VendorMainLoop.setBegin(function(time) {
      callback(new RequestAnimationFrameTick(false));
    });
  }

  setDraw(callback: MainLoopTickCallback): void {
    VendorMainLoop.setDraw(function(time) {
      callback(new RequestAnimationFrameTick(false));
    });
  }

  setEnd(callback: MainLoopTickCallback): void {
    VendorMainLoop.setEnd(function(time) {
      callback(new RequestAnimationFrameTick(false));
    });
  }

  setUpdate(callback: MainLoopTickCallback): void {
    VendorMainLoop.setUpdate(function(time) {
      callback(new RequestAnimationFrameTick(false));
    });
  }

  start(): void {
    VendorMainLoop.setMaxAllowedFPS(30);
    VendorMainLoop.start();
  }

  stop(): void {
    VendorMainLoop.stop();
  }
}

// https://11xnewride.com/tutorials/javascript/how-to-make-javascript-singleton
instance = new MainLoop();
