// @flow

import type { CanvasView } from "./CanvasView";
import type { Drawable } from "./Drawable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends CanvasView, Drawable, Resizeable<"px"> {}
