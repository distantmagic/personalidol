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
        <pi-main-menu-button disabled>{this.i18next.t("ui:menu_continue")}</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonNewGameClick}>{this.i18next.t("ui:menu_new_game")}</pi-main-menu-button>
        <pi-main-menu-button disabled>{this.i18next.t("ui:menu_load_game")}</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonUserSettingsClick}>{this.i18next.t("ui:menu_options")}</pi-main-menu-button>
        <pi-main-menu-button disabled>{this.i18next.t("ui:menu_credits")}</pi-main-menu-button>
      </pi-main-menu-layout>
    );
  }
}
