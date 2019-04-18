// @flow

import type { LoadingManager } from "three";

import type { Resizeable } from "./Resizeable";

export interface SceneManager extends Resizeable<"px"> {
  attach(HTMLCanvasElement): Promise<void>;

  detach(): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;
}
