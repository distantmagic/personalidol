import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { css } from "./MainMenuDOMElementView";

import type { UserSettings } from "./UserSettings.type";

export class InGameMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonExitClick = this.onButtonExitClick.bind(this);
    this.onButtonOptionsClick = this.onButtonOptionsClick.bind(this);
    this.onButtonReturnToGameClick = this.onButtonReturnToGameClick.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, css);
  }

  connectedCallback() {
    super.connectedCallback();

    must(this.uiMessagePort).postMessage({
      isScenePaused: true,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    must(this.uiMessagePort).postMessage({
      isInGameMenuOpened: false,
      isOptionsScreenOpened: false,
      isScenePaused: false,
    });
  }

  onButtonExitClick(evt: MouseEvent) {
    evt.preventDefault();

    must(this.uiMessagePort).postMessage({
      currentMap: null,
    });
  }

  onButtonOptionsClick(evt: MouseEvent) {
    evt.preventDefault();

    must(this.uiMessagePort).postMessage({
      isOptionsScreenOpened: true,
    });
  }

  onButtonReturnToGameClick(evt: MouseEvent) {
    evt.preventDefault();

    must(this.uiMessagePort).postMessage({
      isInGameMenuOpened: false,
    });
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
            <button onClick={this.onButtonOptionsClick}>Options</button>
            <button disabled>Credits</button>
            <button onClick={this.onButtonExitClick}>Exit</button>
          </nav>
        </div>
      </div>
    );
  }
}
