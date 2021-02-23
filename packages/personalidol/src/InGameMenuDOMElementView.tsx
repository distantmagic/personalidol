import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class InGameMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonExitClick = this.onButtonExitClick.bind(this);
    this.onButtonUserSettingsClick = this.onButtonUserSettingsClick.bind(this);
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
      currentMap: null,
    };

    this.uiMessagePort.postMessage(message);
  }

  onButtonUserSettingsClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: true,
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
        <pi-main-menu-button onClick={this.onButtonReturnToGameClick}>Return to game</pi-main-menu-button>
        <pi-main-menu-button disabled>Load Game</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonUserSettingsClick}>Options</pi-main-menu-button>
        <pi-main-menu-button disabled>Credits</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonExitClick}>Exit</pi-main-menu-button>
      </pi-main-menu-layout>
    );
  }
}
