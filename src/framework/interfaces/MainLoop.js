// @flow

import type {
  BeginCallback,
  DrawCallback,
  EndCallback,
  UpdateCallback
} from "mainloop.js";

export interface MainLoop {
  // unset all callbacks
  clear(): void;

  clearDraw(): void;

  clearEnd(): void;

  setBegin(BeginCallback): void;

  setDraw(DrawCallback): void;

  setEnd(EndCallback): void;

  setMaxAllowedFPS(number): void;

  setUpdate(UpdateCallback): void;

  start(): void;

  stop(): void;
}
