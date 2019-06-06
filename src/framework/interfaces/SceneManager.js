// @flow

import type { LoadingManager } from "three";

import type { CancelToken } from "./CancelToken";
import type { Resizeable } from "./Resizeable";
import type { SceneManagerChangeCallback } from "../types/SceneManagerChangeCallback";

export interface SceneManager extends Resizeable<"px"> {
  attach(CancelToken, HTMLCanvasElement): Promise<void>;

  detach(CancelToken): Promise<void>;

  isAttached(): boolean;

  isAttaching(): boolean;

  isDetached(): boolean;

  isDetaching(): boolean;

  onStateChange(SceneManagerChangeCallback): void;

  offStateChange(SceneManagerChangeCallback): void;

  start(): Promise<void>;

  stop(): Promise<void>;
}
