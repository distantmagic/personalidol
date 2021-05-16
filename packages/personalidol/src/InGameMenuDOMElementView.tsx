import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class InGameMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonExitClick = this.onButtonExitClick.bind(this);
    this.onButtonReturnToGameClick = this.onButtonReturnToGameClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    const message: MessageUIStateChange = {
      isScenePaused: true,
    };

    this.uiMessagePort.postMessage(message);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const message: MessageUIStateChange = {
      isInGameMenuOpened: false,
      isScenePaused: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  onButtonExitClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      currentLocationMap: null,
    };

    this.uiMessagePort.postMessage(message);
  }

  onButtonReturnToGameClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      isInGameMenuOpened: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  render() {
    return (
      <pi-main-menu-layout>
        <pi-main-menu-button onClick={this.onButtonReturnToGameClick}>{this.t("ui:menu_return_to_game")}</pi-main-menu-button>
        <pi-main-menu-button disabled>{this.t("ui:menu_load_game")}</pi-main-menu-button>
        <pi-main-menu-user-settings-button />
        <pi-main-menu-language-button />
        <pi-main-menu-button disabled>{this.t("ui:menu_credits")}</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonExitClick}>{this.t("ui:menu_exit")}</pi-main-menu-button>
      </pi-main-menu-layout>
    );
  }
}
