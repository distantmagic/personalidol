// @flow

import { default as VendorMainLoop } from "mainloop.js";

import RequestAnimationFrameTick from "./RequestAnimationFrameTick";
import SingletonException from "./Exception/Singleton";

import type { MainLoop as MainLoopInterface } from "../interfaces/MainLoop";
import type { MainLoopTickCallback } from "../interfaces/MainLoopTickCallback";

let instance;

export default class MainLoop implements MainLoopInterface {
  // +eventEmitter: EventEmitter;

  static getInstance(): MainLoop {
    return instance;
  }

  constructor() {
    if (instance) {
      throw new SingletonException(
        "MainLoop is a singleton. Use `getInstance()` instead."
      );
    }

    // this.eventEmitter = new EventEmitter();
  }

  setDraw(callback: MainLoopTickCallback): void {
    VendorMainLoop.setDraw(function(time) {
      // console.log('mainloop.draw');
      callback(new RequestAnimationFrameTick(false));
    });
  }

  setUpdate(callback: MainLoopTickCallback): void {
    console.log("VendorMainLoop.setUpdate");
    VendorMainLoop.setUpdate(function(time) {
      callback(new RequestAnimationFrameTick(false));
    });
  }

  start(): void {
    VendorMainLoop.setMaxAllowedFPS(4);
    VendorMainLoop.start();
  }

  stop(): void {
    VendorMainLoop.stop();
  }
}

// https://11xnewride.com/tutorials/javascript/how-to-make-javascript-singleton
instance = new MainLoop();
