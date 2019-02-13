// @flow

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { HTMLElementResizeEvent } from "./HTMLElementResizeEvent";

export interface HTMLElementResizeObserver {
  listen(CancelToken): AsyncGenerator<HTMLElementResizeEvent, void, void>;

  observe(HTMLElement): void;

  unobserve(): void;
}
