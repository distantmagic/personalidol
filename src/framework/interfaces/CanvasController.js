// @flow

import type { CanvasView } from "./CanvasView";
import type { Renderable } from "./Renderable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController
  extends CanvasView,
    Renderable,
    Resizeable<"px"> {}
