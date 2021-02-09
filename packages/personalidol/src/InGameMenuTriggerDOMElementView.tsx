import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { DOMZIndex } from "./DOMZIndex.enum";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #ingame-menu-trigger {
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
    -webkit-user-select: none;
    user-select: none;
    z-index: ${DOMZIndex.InGameMenuTrigger};
  }

  #ingame-menu-trigger:pressed {
    color: transparent;
  }
`;

export class InGameMenuTriggerDOMElementView extends DOMElementView {
  constructor() {
    super();

    this.onInGameMenuTriggerClick = this.onInGameMenuTriggerClick.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    must(this.uiMessagePort).postMessage({
      isInGameMenuOpened: false,
    });
  }

  onInGameMenuTriggerClick(evt: MouseEvent) {
    evt.preventDefault();

    must(this.uiMessagePort).postMessage({
      isInGameMenuOpened: true,
    });
  }

  render() {
    return (
      <button id="ingame-menu-trigger" onClick={this.onInGameMenuTriggerClick}>
        menu
      </button>
    );
  }
}
