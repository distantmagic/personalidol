import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { MessageGameStateChange } from "./MessageGameStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class MainMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonNewGameClick = this.onButtonNewGameClick.bind(this);
  }

  onButtonNewGameClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageGameStateChange = {
      currentLocationMap: "map-gates",
    };

    this.gameMessagePort.postMessage(message);
  }

  render() {
    return (
      <pi-main-menu-layout>
        <pi-main-menu-button disabled>{this.t("ui:menu_continue")}</pi-main-menu-button>
        <pi-main-menu-button onClick={this.onButtonNewGameClick}>{this.t("ui:menu_new_game")}</pi-main-menu-button>
        <pi-main-menu-button disabled>{this.t("ui:menu_load_game")}</pi-main-menu-button>
        <pi-main-menu-user-settings-button />
        <pi-main-menu-language-button />
        <pi-main-menu-button disabled>{this.t("ui:menu_credits")}</pi-main-menu-button>
      </pi-main-menu-layout>
    );
  }
}
