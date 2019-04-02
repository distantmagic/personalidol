// @flow

import type { MainLoopTickCallback } from "./MainLoopTickCallback";

export interface MainLoop {
  setDraw(MainLoopTickCallback): void;

  setUpdate(MainLoopTickCallback): void;

  start(): void;

  stop(): void;
}
