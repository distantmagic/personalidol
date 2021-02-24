import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { UserSettings } from "./UserSettings.type";

export class ReloadButtonDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick(evt: MouseEvent) {
    evt.preventDefault();

    window.location.reload();
  }

  render(delta: number) {
    return <pi-button onClick={this.onClick}>{this.i18next.t("ui:reload_button_reload_now")}</pi-button>;
  }
}
