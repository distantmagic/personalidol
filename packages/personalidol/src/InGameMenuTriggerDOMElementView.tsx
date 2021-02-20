import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { ButtonComponent } from "./ButtonComponent";
import { DOMZIndex } from "./DOMZIndex.enum";

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

  ${ButtonComponent.css}
`;

export class InGameMenuTriggerDOMElementView extends DOMElementView<UserSettings> {
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

  onInGameMenuTriggerClick() {
    must(this.uiMessagePort).postMessage({
      isInGameMenuOpened: true,
    });
  }

  render() {
    return (
      <ButtonComponent id="ingame-menu-trigger" onClick={this.onInGameMenuTriggerClick}>
        menu
      </ButtonComponent>
    );
  }
}
