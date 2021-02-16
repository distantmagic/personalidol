import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { DOMZIndex } from "./DOMZIndex.enum";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #options {
    background-color: rgba(0, 0, 0, 0.4);
    bottom: 0;
    display: block;
    font-family: Mukta, sans-serif;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: ${DOMZIndex.Options};
  }

  #options__content {
    background-color: white;
    color: black;
    left: 50%;
    max-height: calc(100% - 6.4rem);
    max-width: 80ch;
    padding: 3.2rem 1.6rem;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - 3.2rem);
  }

  #options__form {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 0.6rem;
  }
`;

export class UserSettingsDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onUseDynamicLightingOptionClick = this.onUseDynamicLightingOptionClick.bind(this);
    this.onUseShadowsOptionClick = this.onUseShadowsOptionClick.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    must(this.uiMessagePort).postMessage({
      isOptionsScreenOpened: false,
    });
  }

  onUseDynamicLightingOptionClick() {
    const userSettings = must(this.userSettings);

    userSettings.useDynamicLighting = !userSettings.useDynamicLighting;

    if (!userSettings.useDynamicLighting) {
      userSettings.useShadows = false;
    }

    userSettings.version += 1;
  }

  onUseShadowsOptionClick() {
    const userSettings = must(this.userSettings);

    userSettings.useShadows = !userSettings.useShadows;
    userSettings.version += 1;
  }

  onOverlayClick(evt: MouseEvent) {
    const target = evt.target;

    if (!target || !(target instanceof HTMLElement) || target.id !== "options") {
      return;
    }

    must(this.uiMessagePort).postMessage({
      isOptionsScreenOpened: false,
    });
  }

  render(delta: number) {
    const userSettings: UserSettings = must(this.userSettings);

    return (
      <div id="options" onClick={this.onOverlayClick}>
        <div id="options__content">
          <form id="options__form">
            <label>shadowMapSize: {String(userSettings.shadowMapSize)}</label>
            <label>
              useDynamicLighting:
              <input checked={userSettings.useDynamicLighting} onClick={this.onUseDynamicLightingOptionClick} type="checkbox" />
            </label>
            <label>
              useShadows:
              <input checked={userSettings.useShadows} disabled={!userSettings.useDynamicLighting} onClick={this.onUseShadowsOptionClick} type="checkbox" />
            </label>
          </form>
        </div>
      </div>
    );
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    super.updateProps(props, tickTimerState);
  }
}
