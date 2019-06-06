// @flow

import type { PointerState } from "./PointerState";

export interface PointerStateDelegate extends PointerState {
  isElementAttached(): boolean;

  setElement(HTMLElement): void;

  unsetElement(): void;
}
