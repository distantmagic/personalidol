// @flow

import EventEmitter from "eventemitter3";
import { default as VendorMainLoop } from "mainloop.js";

import type { MainLoopObserver } from "../interfaces/MainLoopObserver";

export default class MainLoop {
  +eventEmitter: EventEmitter;

  static getInstance(): MainLoop {
    return singleton;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  addObserver(mainLoopObserver: MainLoopObserver) {}
}

const singleton = new MainLoop();
