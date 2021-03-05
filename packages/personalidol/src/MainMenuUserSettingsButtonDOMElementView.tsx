import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class MainMenuUserSettingsButtonDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonUserSettingsClick = this.onButtonUserSettingsClick.bind(this);
  }

  onButtonUserSettingsClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: true,
    };

    this.uiMessagePort.postMessage(message);
  }

  render() {
    return <pi-main-menu-button onClick={this.onButtonUserSettingsClick}>{this.t("ui:menu_options")}</pi-main-menu-button>;
  }
}
