import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { ButtonComponent } from "./ButtonComponent";
import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { DOMZIndex } from "./DOMZIndex.enum";
import { SliderComponent } from "./SliderComponent";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #options {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 0;
    font-family: Mukta, sans-serif;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: ${DOMZIndex.Options};
  }

  #options__content {
    color: white;
  }

  #options__form {
    align-items: center;
    display: grid;
    grid-row-gap: 3rem;
  }

  dl {
    margin: 0;
  }

  dd {
    font-weight: lighter;
    margin: 0;
  }

  h1 {
    background-color: black;
    border-bottom: 1px solid white;
    display: grid;
    font-family: Almendra;
    font-size: 3.2rem;
    font-variant: small-caps;
    font-weight: normal;
    grid-template-columns: 1fr auto;
    line-height: 1;
    margin-bottom: 2.4rem;
    padding-bottom: 0.8rem;
    position: sticky;
    top: 0;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    #options {
      align-items: center;
      background-color: black;
      justify-content: center;
      display: grid;
      overflow-y: auto;
    }

    #options__content {
      padding-bottom: 3.2rem;
      padding-left: 1.6rem;
      padding-right: 1.6rem;
      padding-top: 0rem;
      max-width: 60ch;
    }

    h1 {
      padding-top: 1.6rem;
      margin-top: 1.6rem;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    #options {
      display: block;
    }

    #options__content {
      background-color: black;
      bottom: 0;
      left: calc(400px + 1.6rem);
      overflow-y: auto;
      padding-bottom: 6.4rem;
      padding-left: 4.8rem;
      padding-right: 4.8rem;
      padding-top: 0;
      position: absolute;
      top: 0;
      width: calc(100% - 400px - 3.2rem);
    }

    h1 {
      margin-top: 4.8rem;
      padding-top: 1.6rem;
    }
  }

  @media (max-width: ${DOMBreakpoints.TabletMax}px) {
    #options__form {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: ${DOMBreakpoints.DesktopMin}px) {
    #options__content {
      max-width: 1024px;
    }

    #options__form {
      grid-column-gap: 2rem;
      grid-template-columns: 1fr 1fr;
    }
  }

  ${ButtonComponent.css}
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

    this.close = this.close.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onShadowMapSizeChange = this.onShadowMapSizeChange.bind(this);
    this.onShowStatsReporterChange = this.onShowStatsReporterChange.bind(this);
    this.onUseDynamicLightingChange = this.onUseDynamicLightingChange.bind(this);
    this.onUseShadowsChange = this.onUseShadowsChange.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  close() {
    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: false,
    };

    must(this.uiMessagePort).postMessage(message);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.close();
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

  onShowStatsReporterChange(showStatsReporter: boolean) {
    const userSettings = must(this.userSettings);

    userSettings.showStatsReporter = showStatsReporter;
    userSettings.version += 1;
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

    this.close();
  }

  render(delta: number) {
    const userSettings: UserSettings = must(this.userSettings);

    return (
      <div id="options" onClick={this.onOverlayClick}>
        <div id="options__content">
          <h1>
            Options
            <ButtonComponent onClick={this.close}>done</ButtonComponent>
          </h1>
          <form id="options__form">
            <dl>
              <dt>Use Multiple Light Sources</dt>
              <dd>
                Can greatly affect performance. If you disable multiple light sources, background light will have more intensity and everything will be uniformly highlighted.
              </dd>
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
              <dd>If you are not using multiple light sources you can disable this option as well since it will provide almost no visual enhancements without dynamic lighting.</dd>
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
              <dd>Bigger values improve shadows quality, but affect performance and memory usage.</dd>
            </dl>
            <SliderComponent
              currentValue={userSettings.shadowMapSize}
              edgeLabels={_lowHighEdgeLabels}
              labels={_shadowMapSizeLabels}
              onChange={this.onShadowMapSizeChange}
              values={_shadowMapSizeValues}
            />
            <dl>
              <dt>Show Rendering Stats</dt>
              <dd>
                Primarily used for debugging, but you can check your actual framerate and memory usage if you want to fine-tune your settings and you know what you are doing.
              </dd>
            </dl>
            <SliderComponent
              currentValue={userSettings.showStatsReporter}
              edgeLabels={_booleanEdgeLabels}
              onChange={this.onShowStatsReporterChange}
              labels={_booleanLabels}
              values={_booleanValues}
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
