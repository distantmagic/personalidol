import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { ProgressManagerState } from "@personalidol/framework/src/ProgressManagerState.type";

import type { UserSettings } from "./UserSettings.type";

type Resources = {
  [key: string]: number;
};

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  .progress {
    bottom: 1.6rem;
    display: grid;
    grid-row-gap: 1rem;
    left: 1.6rem;
    position: absolute;
    right: 1.6rem;
  }

  .progress-comment,
  .progress-value,
  .progress-indicator {
    line-height: 1rem;
  }

  .progress-comment,
  .progress-value {
    color: #eeeeee;
    bottom: 2.4rem;
    font-family: sans-serif;
    font-size: 1rem;
    font-variant: small-caps;
    grid-template-columns: auto auto;
    letter-spacing: 0.1ch;
    text-transform: lowercase;
  }

  .progress-comment {
    grid-area: comment;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .progress-message {
    align-items: flex-end;
    display: grid;
    grid-template-rows: 1rem 0.8rem;
    grid-template-areas:
      "comment value"
      "indicator indicator"
    ;
  }

  .progress-value {
    font-size: 0.8rem;
    grid-area: value;
    text-align: right;
  }

  .progress-indicator,
  .progress-bar {
    height: 0.2rem;
  }

  .progress-indicator {
    align-items: center;
    background-color: #333333;
    display: grid;
    grid-area: indicator;
  }

  .progress-bar {
    background-color: #eeeeee;
    color: transparent;
    display: block;
    transition: width 0.1s ease-in-out;
    will-change: width;
  }
`;

export class ProgressManagerStateDOMElementView extends DOMElementView<UserSettings> {
  static get observedAttributes() {
    return ["comment", "progress"];
  }
  public css: string = _css;

  // private _progress: number = 0;
  private _progressPercentage: string = "0%";
  private _resources: Resources = {};

  set progress(progress: number) {
    this._progressPercentage = `${Math.round(100 * progress)}%`;
  }

  set progressManagerState(progressManagerState: ProgressManagerState) {
    this.needsRender = true;

    const loading = Math.max(progressManagerState.messages.length, progressManagerState.expect);

    let _loaded: number = 0;
    let _messageProgress: number = 0;

    this._resources = {};

    for (let message of progressManagerState.messages) {
      if (message.total > 0) {
        _messageProgress = message.loaded / message.total;
        _loaded += _messageProgress;
      } else {
        _messageProgress = 0;
      }
      if (_messageProgress < 1) {
        if (!this._resources.hasOwnProperty(message.type)) {
          this._resources[message.type] = 0;
        }

        this._resources[message.type] += 1;
      }
    }

    this.progress = _loaded / loading;
  }

  constructor() {
    super();

    this.renderResources = this.renderResources.bind(this);
  }

  renderResources(): string {
    const ret: Array<string> = [];

    for (let resource in this._resources) {
      if (this._resources.hasOwnProperty(resource)) {
        ret.push(
          this.t(`ui:resource_type_accusative_${resource}_count`, {
            count: this._resources[resource],
          })
        );
      }
    }

    return ret.join(", ");
  }

  render() {
    return (
      <main class="progress">
        <div class="progress-message">
          <div class="progress-comment">
            {`${this.t("ui:loading")}`} {this.renderResources()} {"..."}
          </div>
          <div class="progress-value">{this._progressPercentage}</div>
          <div class="progress-indicator">
            <div
              class="progress-bar"
              style={{
                width: this._progressPercentage,
              }}
            ></div>
          </div>
        </div>
      </main>
    );
  }
}
