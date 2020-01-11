// @flow strict

import type { BeginCallback, DrawCallback, EndCallback, UpdateCallback } from "mainloop.js";

import type { Scheduler } from "./Scheduler";

export interface MainLoop {
  attachScheduler(Scheduler): void;

  // unset all callbacks
  clear(): void;

  clearBegin(): void;

  clearDraw(): void;

  clearEnd(): void;

  clearUpdate(): void;

  setBegin(BeginCallback): void;

  setDraw(DrawCallback): void;

  setEnd(EndCallback): void;

  setMaxAllowedFPS(number): void;

  setUpdate(UpdateCallback): void;

  start(): void;

  stop(): void;
}
