// @flow

import type { AnimateCallback } from "mainloop.js";

export interface MainLoop {
  // unset all callbacks
  clear(): void;

  clearDraw(): void;

  clearEnd(): void;

  setBegin(AnimateCallback): void;

  setDraw(AnimateCallback): void;

  setEnd(AnimateCallback): void;

  setUpdate(AnimateCallback): void;

  start(): void;

  stop(): void;
}
