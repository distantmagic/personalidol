// @flow strict

import type { Observer } from "./Observer";
import type { Resizeable } from "./Resizeable";

export interface HTMLElementResizeObserver extends Observer {
  off(Resizeable<"px">): void;

  notify(Resizeable<"px">): void;
}
