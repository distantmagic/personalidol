import type { VNode } from "preact";

export interface DOMElementViewStyler {
  readonly isDOMElementViewStyler: true;

  connectedCallback(shadow: ShadowRoot): void;

  render(): null | VNode<any>;
}
