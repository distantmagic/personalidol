import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import { DOMZIndex } from "./DOMZIndex.enum";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #ingame-menu-trigger {
    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
    z-index: ${DOMZIndex.InGameMenuTrigger};
  }
`;

export class InGameMenuTriggerDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  constructor() {
    super();

    this.onInGameMenuTriggerClick = this.onInGameMenuTriggerClick.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const message: MessageUIStateChange = {
      isInGameMenuOpened: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  onInGameMenuTriggerClick() {
    const message: MessageUIStateChange = {
      isInGameMenuOpened: true,
    };

    this.uiMessagePort.postMessage(message);
  }

  render() {
    return (
      <pi-button id="ingame-menu-trigger" onClick={this.onInGameMenuTriggerClick}>
        menu
      </pi-button>
    );
  }
}
