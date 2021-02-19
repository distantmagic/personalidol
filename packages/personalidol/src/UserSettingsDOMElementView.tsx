import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { DOMZIndex } from "./DOMZIndex.enum";
import { SliderComponent } from "./SliderComponent";

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
    max-width: 100ch;
    padding: 3.2rem 1.6rem;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - 3.2rem);
  }

  #options__form {
    align-items: center;
    display: grid;
    grid-column-gap: 2rem;
    grid-row-gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }

  dl {
    margin: 0;
  }

  dd {
    font-weight: lighter;
    margin: 0;
  }

  ${SliderComponent.css}
`;

const _booleanEdgeLabels: ["", ""] = ["", ""];
const _booleanLabels: ["off", "on"] = ["off", "on"];
const _booleanValues: [false, true] = [false, true];

const _lowHighEdgeLabels: ["low", "high"] = ["low", "high"];

const _shadowMapSizeLabels = ["512", "1024", "2048", "4096"];
const _shadowMapSizeValues = [512, 1024, 2048, 4096];

export class UserSettingsDOMElementView extends DOMElementView<UserSettings> {
  constructor() {
    super();

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onShadowMapSizeChange = this.onShadowMapSizeChange.bind(this);
    this.onUseDynamicLightingChange = this.onUseDynamicLightingChange.bind(this);
    this.onUseShadowsChange = this.onUseShadowsChange.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    must(this.uiMessagePort).postMessage({
      isOptionsScreenOpened: false,
    });
  }

  onShadowMapSizeChange(shadowMapSize: number) {
    const userSettings = must(this.userSettings);

    switch (shadowMapSize) {
      case 512:
      case 1024:
      case 2048:
      case 4096:
        userSettings.shadowMapSize = shadowMapSize;
        userSettings.version += 1;
        return;
      default:
        throw new Error(`Unexpected shadowmap size: "${shadowMapSize}"`);
    }
  }

  onUseDynamicLightingChange(useDynamicLighting: boolean) {
    const userSettings = must(this.userSettings);

    userSettings.useDynamicLighting = useDynamicLighting;
    userSettings.version += 1;
  }

  onUseShadowsChange(useShadows: boolean) {
    const userSettings = must(this.userSettings);

    userSettings.useShadows = useShadows;
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
            <dl>
              <dt>Use Multiple Light Sources</dt>
              <dd></dd>
            </dl>
            <SliderComponent
              currentValue={userSettings.useDynamicLighting}
              edgeLabels={_booleanEdgeLabels}
              onChange={this.onUseDynamicLightingChange}
              labels={_booleanLabels}
              values={_booleanValues}
            />
            <dl>
              <dt>Use Shadows</dt>
            </dl>
            <SliderComponent
              currentValue={userSettings.useShadows}
              edgeLabels={_booleanEdgeLabels}
              onChange={this.onUseShadowsChange}
              labels={_booleanLabels}
              values={_booleanValues}
            />
            <dl>
              <dt>Shadow Map Size</dt>
              <dd>bigger values improve shadows quality, but affect performance and memory usage</dd>
            </dl>
            <SliderComponent
              currentValue={userSettings.shadowMapSize}
              edgeLabels={_lowHighEdgeLabels}
              labels={_shadowMapSizeLabels}
              onChange={this.onShadowMapSizeChange}
              values={_shadowMapSizeValues}
            />
          </form>
        </div>
      </div>
    );
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    super.updateProps(props, tickTimerState);
  }
}
