import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

// import type { MessageProgressChange } from "@personalidol/loading-manager/src/MessageProgressChange.type";
import type { ProgressManagerState } from "@personalidol/loading-manager/src/ProgressManagerState.type";

import type { UserSettings } from "./UserSettings.type";

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

  set progress(progress: number) {
    // this._progress = progress;
    this._progressPercentage = `${Math.round(100 * progress)}%`;
  }

  set progressManagerState(progressManagerState: ProgressManagerState) {
    this.needsRender = true;

    const loading = Math.max(progressManagerState.messages.length, progressManagerState.expect);

    let _loaded: number = 0;

    for (let message of progressManagerState.messages) {
      if (message.total > 0) {
        _loaded += message.loaded / message.total;
      }
    }

    this.progress = _loaded / loading;
  }

  render() {
    return (
      <main class="progress">
        <div class="progress-message">
          <div class="progress-comment">{`${this.i18next.t("ui:loading")} ...`}</div>
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
