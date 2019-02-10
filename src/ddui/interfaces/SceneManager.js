// @flow

import type { Resizeable } from "./Resizeable";

export interface SceneManager extends Resizeable {
  attach(HTMLCanvasElement): Promise<void>;
}
