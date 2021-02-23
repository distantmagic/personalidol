import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  #comment,
  #progress-value,
  #progress-indicator {
    position: absolute;
    line-height: 1rem;
  }

  #comment,
  #progress-indicator {
    left: 1.6rem;
  }

  #comment,
  #progress-value {
    color: #eeeeee;
    bottom: 2.4rem;
    font-family: sans-serif;
    font-size: 1rem;
    font-variant: small-caps;
    grid-template-columns: auto auto;
    letter-spacing: 0.1ch;
    text-transform: lowercase;
  }

  #comment {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 6.4rem);
  }

  #progress-value {
    font-size: 0.8rem;
    right: 1.6rem;
    text-align: right;
  }

  #progress-indicator,
  #progress-bar {
    height: 0.2rem;
  }

  #progress-indicator {
    align-items: center;
    background-color: #333333;
    bottom: 1.6rem;
    display: grid;
    width: calc(100% - 3.2rem);
  }

  #progress-bar {
    background-color: #eeeeee;
    color: transparent;
    display: block;
    transition: width 0.1s ease-in-out;
    will-change: width;
  }
`;

export class LoadingScreenDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  private _progressPercentage: string = "0%";
  private _progressManagerProgress: null | ProgressManagerProgress = null;

  set progressManagerProgress(progressManagerProgress: ProgressManagerProgress) {
    this.needsRender = true;

    this._progressManagerProgress = progressManagerProgress;

    const progress = Math.round(progressManagerProgress.progress * 100);

    this._progressPercentage = `${progress}%`;
  }

  render() {
    if (!this._progressManagerProgress) {
      return (
        <main id="loading-progress">
          <div id="comment">Loading ...</div>
        </main>
      );
    }

    return (
      <main id="loading-progress">
        <div id="comment">Loading {this._progressManagerProgress.comment} ...</div>
        <div id="progress-value"></div>
        <div id="progress-indicator">
          <div
            id="progress-bar"
            style={{
              width: this._progressPercentage,
            }}
          >
            {this._progressPercentage}
          </div>
        </div>
      </main>
    );
  }
}
