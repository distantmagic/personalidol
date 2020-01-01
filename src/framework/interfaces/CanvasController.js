// @flow

import type { CanvasView } from "./CanvasView";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends CanvasView, Resizeable<"px"> {}
