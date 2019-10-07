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

  /**
   * This method mat be called directly from a HTML event callback, so it's not
   * guaranteed that it always be possible to hold off other actions until this
   * one is done. Nonetheless it should properly handle promises and behave
   * like it's not the case.
   */
  setCanvasElement(?HTMLCanvasElement): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;
}
