import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import { css } from "./MainMenuDOMElementView";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export class InGameMenuDOMElementView extends DOMElementView<UserSettings> {
  public css: string = css;

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
      isUserSettingsScreenOpened: false,
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
      <div id="main-menu">
        <div id="main-menu__content">
          <h1>Personal Idol</h1>
          <h2>You shall not be judged</h2>
          <nav>
            <button onClick={this.onButtonReturnToGameClick}>Return to game</button>
            <button disabled>Load Game</button>
            <button onClick={this.onButtonUserSettingsClick}>Options</button>
            <button disabled>Credits</button>
            <button onClick={this.onButtonExitClick}>Exit</button>
          </nav>
        </div>
      </div>
    );
  }
}
