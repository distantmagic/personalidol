import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { DOMZIndex } from "./DOMZIndex.enum";

import type { JSX } from "preact";

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
    max-width: 120ch;
    padding: 3.2rem 1.6rem;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - 3.2rem);
  }

  #options__form {
    display: grid;
    grid-row-gap: 1rem;
    grid-template-columns: 1fr;
  }

  label {
    align-items: flex-start;
    display: grid;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
  }

  dl {
    margin: 0;
  }

  dd {
    font-weight: lighter;
    margin: 0;
  }
`;

export class UserSettingsDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onShadowMapSizeChange = this.onShadowMapSizeChange.bind(this);
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

  onShadowMapSizeChange(evt: JSX.TargetedEvent<HTMLSelectElement>) {
    const userSettings = must(this.userSettings);
    const shadowMapSize = Number(evt.currentTarget.value);

    switch (shadowMapSize) {
      case 512:
      case 1024:
      case 2048:
      case 4096:
        userSettings.shadowMapSize = shadowMapSize;
        userSettings.version += 1;
        return;
      default:
        throw new Error(`Unexpected shadowmap size: "${userSettings.shadowMapSize}"`);
    }
  }

  onUseDynamicLightingOptionClick() {
    const userSettings = must(this.userSettings);

    userSettings.useDynamicLighting = !userSettings.useDynamicLighting;
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
            <label>
              <dl>
                <dt>Use Multiple Light Sources</dt>
                <dd></dd>
              </dl>
              <span>{userSettings.useDynamicLighting ? "on" : "off"}</span>
              <input checked={userSettings.useDynamicLighting} onClick={this.onUseDynamicLightingOptionClick} type="checkbox" />
            </label>
            <label>
              <dl>
                <dt>Use Shadows</dt>
              </dl>
              <span>{userSettings.useShadows ? "on" : "off"}</span>
              <input checked={userSettings.useShadows} onClick={this.onUseShadowsOptionClick} type="checkbox" />
            </label>
            <label>
              <dl>
                <dt>Shadows Quality</dt>
                <dd>(shadow map size)</dd>
              </dl>
              <span>
                {userSettings.shadowMapSize}x{userSettings.shadowMapSize}
              </span>
              <select onChange={this.onShadowMapSizeChange} value={userSettings.shadowMapSize}>
                <option value="4096">Ultra (4096x4096)</option>
                <option value="2048">High (2048x2048)</option>
                <option value="1024">Medium (1024x1024)</option>
                <option value="512">Low (512x512)</option>
              </select>
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
