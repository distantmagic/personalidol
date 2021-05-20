import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { DOMElementViewContext } from "./DOMElementViewContext.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #pi-button {
    background-color: transparent;
    border: 1px solid white;
    color: white;
    cursor: pointer;
    font-family: Mukta;
    font-size: 1rem;
    line-height: 1;
    padding: 0.8rem 1.6rem;
    -webkit-user-select: none;
    user-select: none;
  }
`;

export class ButtonDOMElementView extends DOMElementView<DOMElementViewContext> {
  public css: string = _css;

  render(delta: number) {
    return (
      <button id="pi-button">
        <slot />
      </button>
    );
  }
}
