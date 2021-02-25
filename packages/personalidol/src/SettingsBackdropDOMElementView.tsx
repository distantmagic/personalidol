import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { DOMZIndex } from "./DOMZIndex.enum";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #overlay {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 0;
    font-family: Mukta, sans-serif;
    left: 0;
    line-height: 1.7;
    position: absolute;
    right: 0;
    top: 0;
    z-index: ${DOMZIndex.Settings};
  }

  #overlay__content {
    color: white;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    #overlay {
      align-items: center;
      background-color: black;
      justify-content: center;
      display: grid;
      overflow-y: auto;
    }

    #overlay__content {
      padding-bottom: 3.2rem;
      padding-left: 1.6rem;
      padding-right: 1.6rem;
      padding-top: 0rem;
      max-width: 60ch;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    #overlay {
      display: block;
    }

    #overlay__content {
      background-color: black;
      bottom: 0;
      left: calc(400px + 3.2rem);
      overflow-y: auto;
      padding-bottom: 6.4rem;
      padding-left: 4.8rem;
      padding-right: 4.8rem;
      padding-top: 0;
      position: absolute;
      top: 0;
    }
  }

  @media (min-width: ${DOMBreakpoints.DesktopMin}px) {
    #overlay__content {
      max-width: 1024px;
    }
  }
`;

export class SettingsBackdropDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick(evt: MouseEvent) {
    const target = evt.target;

    if (!target || !(target instanceof HTMLElement) || target.id !== "overlay") {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("DirectClick", {
        bubbles: false,
        composed: false,
      })
    );
  }

  render(delta: number) {
    return (
      <div id="overlay" onClick={this.onClick}>
        <div id="overlay__content">
          <slot />
        </div>
      </div>
    );
  }
}
