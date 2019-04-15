// @flow

import type { Resizeable } from "./Resizeable";

export interface HTMLElementResizeObserver {
  constructor(HTMLElement): void;

  disconnect(): void;

  notify(Resizeable): void;

  observe(): void;
}
