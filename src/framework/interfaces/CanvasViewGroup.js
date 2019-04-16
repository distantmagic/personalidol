// @flow

import type { CanvasView } from "./CanvasView";

export interface CanvasViewGroup extends CanvasView {
  add(CanvasView): void;
}
