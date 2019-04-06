// @flow

import type { LoadingManager } from "three";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { Resizeable } from "./Resizeable";

export interface SceneManager extends Resizeable {
  attach(HTMLCanvasElement): Promise<void>;

  detach(): Promise<void>;

  loop(CancelToken): Promise<void>;
}
