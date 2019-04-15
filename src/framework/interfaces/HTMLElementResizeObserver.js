// @flow

import type { Observer } from "./Observer";
import type { Resizeable } from "./Resizeable";

export interface HTMLElementResizeObserver extends Observer {
  constructor(HTMLElement): void;

  notify(Resizeable): void;
}
