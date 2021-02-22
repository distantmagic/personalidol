import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { DOMZIndex } from "./DOMZIndex.enum";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

export const css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #main-menu {
    bottom: 0;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-user-select: none;
    user-select: none;
    z-index: ${DOMZIndex.MainMenu};
    align-items: flex-start;
    color: white;
    display: grid;
    font-size: 1.6rem;
    height: 100%;
    pointer-events: auto;
  }

  #main-menu__content {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.6rem;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    #main-menu {
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      left: 0;
    }

    #main-menu__content {
      width: 100%;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    #main-menu {
      justify-content: flex-start;
      left: 3.2rem;
    }

    #main-menu__content {
      background-color: rgba(0, 0, 0, 0.8);
      width: 400px;
    }
  }

  h1,
  h2,
  nav {
    position: relative;
  }

  h1,
  h2 {
    font-family: "Almendra", sans-serif;
    -webkit-font-kerning: normal;
    font-kerning: normal;
    line-height: 1;
    margin: 0;
    text-align: center;
  }

  h1 {
    font-size: 3.2rem;
    font-weight: normal;
    letter-spacing: -0.1ch;
    margin: 0;
  }

  h2 {
    font-size: 1.4rem;
    font-variant: small-caps;
    text-transform: lowercase;
    word-spacing: 0.6ch;
  }

  nav {
    align-self: flex-start;
    display: grid;
    padding-top: 3.2rem;
    width: 100%;
  }

  button {
    background-color: transparent;
    border: 1px solid transparent;
    font-family: "Mukta", sans-serif;
    font-size: 1.4rem;
    font-variant: small-caps;
    font-weight: 300;
    line-height: 1;
    padding: 0.8rem 1.6rem;
    text-align: center;
    text-transform: lowercase;
    width: 100%;
  }

  button:disabled {
    color: rgba(255, 255, 255, 0.4);
  }

  button:enabled {
    color: white;
    cursor: pointer;
  }

  button:enabled:hover {
    border-color: white;
  }

  button:focus {
    outline: none;
  }
`;

export class MainMenuDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onButtonNewGameClick = this.onButtonNewGameClick.bind(this);
    this.onButtonUserSettingsClick = this.onButtonUserSettingsClick.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, css);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: false,
    };

    must(this.uiMessagePort).postMessage(message);
  }

  onButtonNewGameClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      currentMap: "map-gates",
    };

    must(this.uiMessagePort).postMessage(message);
  }

  onButtonUserSettingsClick(evt: MouseEvent) {
    evt.preventDefault();

    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: true,
    };

    must(this.uiMessagePort).postMessage(message);
  }

  render() {
    return (
      <div id="main-menu">
        <div id="main-menu__content">
          <h1>Personal Idol</h1>
          <h2>You shall not be judged</h2>
          <nav>
            <button disabled>Continue</button>
            <button onClick={this.onButtonNewGameClick}>New Game</button>
            <button disabled>Load Game</button>
            <button onClick={this.onButtonUserSettingsClick}>Options</button>
            <button disabled>Credits</button>
          </nav>
        </div>
      </div>
    );
  }
}
