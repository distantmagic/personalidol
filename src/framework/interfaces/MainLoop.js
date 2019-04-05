// @flow

import type { MainLoopTickCallback } from "./MainLoopTickCallback";

export interface MainLoop {
  // unset all callbacks
  clear(): void;

  clearDraw(): void;

  clearEnd(): void;

  setBegin(MainLoopTickCallback): void;

  setDraw(MainLoopTickCallback): void;

  setEnd(MainLoopTickCallback): void;

  setUpdate(MainLoopTickCallback): void;

  start(): void;

  stop(): void;
}
