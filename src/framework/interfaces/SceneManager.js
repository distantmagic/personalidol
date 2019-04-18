// @flow

import type { LoadingManager } from "three";

import type { CancelToken } from "./CancelToken";
import type { Resizeable } from "./Resizeable";

export interface SceneManager extends Resizeable<"px"> {
  attach(CancelToken, HTMLCanvasElement): Promise<void>;

  detach(CancelToken): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;
}
