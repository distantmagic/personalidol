// @flow

import type { Observer } from "./Observer";
import type { Resizeable } from "./Resizeable";

export interface HTMLElementResizeObserver extends Observer {
  notify(Resizeable<"px">): void;
}
