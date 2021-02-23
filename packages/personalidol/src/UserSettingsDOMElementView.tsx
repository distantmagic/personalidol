import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { isCustomEvent } from "@personalidol/framework/src/isCustomEvent";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { DOMZIndex } from "./DOMZIndex.enum";

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
    line-height: 1.7;
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
    align-items: center;
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
      left: calc(400px + 3.2rem);
      overflow-y: auto;
      padding-bottom: 6.4rem;
      padding-left: 4.8rem;
      padding-right: 4.8rem;
      padding-top: 0;
      position: absolute;
      top: 0;
      width: calc(100% - 400px - 4.8rem);
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
`;

const _booleanEdgeLabels: ["", ""] = ["", ""];
const _booleanLabels: ["off", "on"] = ["off", "on"];
const _booleanValues: [false, true] = [false, true];

const _lowHighEdgeLabels: ["low", "high"] = ["low", "high"];

const _pixelRatioLabels = ["25%", "50%", "75%", "100%"];
const _pixelRatioValues = [0.25, 0.5, 0.75, 1];

const _shadowMapSizeLabels = ["512", "1024", "2048", "4096"];
const _shadowMapSizeValues = [512, 1024, 2048, 4096];

export class UserSettingsDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;
  public userSettingsLastAcknowledgedVersion: number = -1;

  constructor() {
    super();

    this.close = this.close.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onPixelRatioChange = this.onPixelRatioChange.bind(this);
    this.onShadowMapSizeChange = this.onShadowMapSizeChange.bind(this);
    this.onShowStatsReporterChange = this.onShowStatsReporterChange.bind(this);
    this.onUseDynamicLightingChange = this.onUseDynamicLightingChange.bind(this);
    this.onUseShadowsChange = this.onUseShadowsChange.bind(this);
  }

  close() {
    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.close();
  }

  onPixelRatioChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onPixelRatioChange'.");
    }

    this.userSettings.pixelRatio = Number(evt.detail);
    this.userSettings.version += 1;
  }

  onShadowMapSizeChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onShadowMapSizeChange'.");
    }

    switch (evt.detail) {
      case 512:
      case 1024:
      case 2048:
      case 4096:
        this.userSettings.shadowMapSize = evt.detail;
        this.userSettings.version += 1;
        return;
      default:
        throw new Error(`Unexpected shadowmap size: "${evt.detail}"`);
    }
  }

  onShowStatsReporterChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onShowStatsReporterChange'.");
    }

    this.userSettings.showStatsReporter = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onUseDynamicLightingChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onUseDynamicLightingChange'.");
    }

    this.userSettings.useDynamicLighting = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onUseShadowsChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onUseShadowsChange'.");
    }

    this.userSettings.useShadows = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onOverlayClick(evt: MouseEvent) {
    const target = evt.target;

    if (!target || !(target instanceof HTMLElement) || target.id !== "options") {
      return;
    }

    this.close();
  }

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    super.beforeRender(delta, elapsedTime, tickTimerState);

    if (this.needsRender) {
      return;
    }

    this.needsRender = this.userSettingsLastAcknowledgedVersion < this.userSettings.version;
    this.userSettingsLastAcknowledgedVersion = this.userSettings.version;
  }

  render(delta: number) {
    return (
      <div id="options" onClick={this.onOverlayClick}>
        <div id="options__content">
          <h1>
            Options
            <pi-button onClick={this.close}>done</pi-button>
          </h1>
          <form id="options__form">
            <dl>
              <dt>Rendering Resolution</dt>
              <dd>
                Your device pixel ratio is {this.userSettings.devicePixelRatio} (which means {this.userSettings.devicePixelRatio} physical pixel per rendered pixel). You can reduce
                the ratio to decrease the rendering resolution, which makes everyting more blurry, but increases the performance.
              </dd>
            </dl>
            <pi-slider
              currentValue={this.userSettings.pixelRatio}
              edgeLabels={_lowHighEdgeLabels}
              labels={_pixelRatioLabels}
              onChange={this.onPixelRatioChange}
              values={_pixelRatioValues}
            />
            <dl>
              <dt>Use Multiple Light Sources</dt>
              <dd>
                Can greatly affect performance. If you disable multiple light sources, background light will have more intensity and everything will be uniformly highlighted.
              </dd>
            </dl>
            <pi-slider
              currentValue={this.userSettings.useDynamicLighting}
              edgeLabels={_booleanEdgeLabels}
              labels={_booleanLabels}
              onChange={this.onUseDynamicLightingChange}
              values={_booleanValues}
            />
            <dl>
              <dt>Use Shadows</dt>
              <dd>If you are not using multiple light sources you can disable this option as well since it will provide almost no visual enhancements without dynamic lighting.</dd>
            </dl>
            <pi-slider
              currentValue={this.userSettings.useShadows}
              edgeLabels={_booleanEdgeLabels}
              labels={_booleanLabels}
              onChange={this.onUseShadowsChange}
              values={_booleanValues}
            />
            <dl>
              <dt>Shadow Map Size</dt>
              <dd>Bigger values improve shadows quality, but affect performance and memory usage.</dd>
            </dl>
            <pi-slider
              currentValue={this.userSettings.shadowMapSize}
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
            <pi-slider
              currentValue={this.userSettings.showStatsReporter}
              edgeLabels={_booleanEdgeLabels}
              labels={_booleanLabels}
              onChange={this.onShowStatsReporterChange}
              values={_booleanValues}
            />
          </form>
        </div>
      </div>
    );
  }
}
