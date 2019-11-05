// @flow

import type { Disposable } from "./Disposable";
import type { Drawable } from "./Drawable";
import type { Resizeable } from "./Resizeable";

export interface CanvasController extends Disposable, Drawable, Resizeable<"px"> {}
