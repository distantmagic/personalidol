import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  h1 {
    align-items: center;
    background-color: black;
    border-bottom: 1px solid white;
    display: grid;
    font-family: Almendra;
    font-size: 3.2rem;
    font-variant: small-caps;
    font-weight: normal;
    grid-column-gap: 1.6rem;
    grid-template-columns: 1fr auto;
    line-height: 1;
    margin: 0;
    margin-bottom: 3.2rem;
    min-width: 12ch;
    padding-bottom: 1.6rem;
    position: sticky;
    top: 0;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    h1 {
      padding-top: 1.6rem;
      margin-top: 1.6rem;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    h1 {
      margin-top: 4.8rem;
      padding-top: 1.6rem;
    }
  }

  #language-settings {
    color: white;
  }
`;

export class LanguageSettingsDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  constructor() {
    super();

    this.close = this.close.bind(this);
  }

  close() {
    const message: MessageUIStateChange = {
      isLanguageSettingsScreenOpened: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.close();
  }

  onLanguageChange(language: string): (evt: MouseEvent) => void {
    const self: this = this;

    return function (evt: MouseEvent): void {
      evt.preventDefault();

      if (language === self.userSettings.language) {
        return;
      }

      self.userSettings.language = language;
      self.userSettings.version += 1;
    };
  }

  render(delta: number) {
    return (
      <pi-settings-backdrop onDirectClick={this.close}>
        <h1>
          {this.i18next.t("ui:user_settings_language")}
          <pi-button onClick={this.close}>{this.i18next.t("ui:user_settings_done").toLocaleLowerCase()}</pi-button>
        </h1>
        <pi-main-menu-button active={"en" === this.i18next.language} onClick={this.onLanguageChange("en")}>
          English
        </pi-main-menu-button>
        <pi-main-menu-button active={"pl" === this.i18next.language} onClick={this.onLanguageChange("pl")}>
          Polski
        </pi-main-menu-button>
      </pi-settings-backdrop>
    );
  }
}
