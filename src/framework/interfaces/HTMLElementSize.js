// @flow

import type { ElementSize } from "./ElementSize";

export interface HTMLElementSize extends ElementSize {
  getHTMLElement(): HTMLElement;
}
