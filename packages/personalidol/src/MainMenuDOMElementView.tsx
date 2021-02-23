import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class MainMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonNewGameClick = this.onButtonNewGameClick.bind(this);
    this.onButtonUserSettingsClick = this.onButtonUserSettingsClick.bind(this);
  }

  onButtonNewGameClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      currentMap: "map-gates",
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

  render() {
    return (
      <pi-main-menu-layout>
        <pi-main-menu-button disabled>Continue</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonNewGameClick}>New Game</pi-main-menu-button>
        <pi-main-menu-button disabled>Load Game</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonUserSettingsClick}>Options</pi-main-menu-button>
        <pi-main-menu-button disabled>Credits</pi-main-menu-button>
      </pi-main-menu-layout>
    );
  }
}
