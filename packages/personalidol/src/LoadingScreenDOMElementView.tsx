import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { ProgressManagerComment } from "@personalidol/loading-manager/src/ProgressManagerComment.type";
import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

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
    will-change: width;
  }
`;

export class LoadingScreenDOMElementView extends DOMElementView<UserSettings> {
  static get observedAttributes() {
    return ["comment", "progress"];
  }
  public css: string = _css;

  private _progressComment: string = "";
  private _progressPercentage: string = "0%";

  constructor() {
    super();

    this.createComment = this.createComment.bind(this);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    this.needsRender = true;

    switch (name) {
      case "comment":
        this._progressComment = this.i18next.t(newValue);
        break;
      case "progress":
        this._progressPercentage = `${Math.round(parseFloat(newValue) * 100)}%`;
        break;
    }
  }

  set progressManagerProgress(progressManagerProgress: ProgressManagerProgress) {
    this.needsRender = true;

    this._progressComment = progressManagerProgress.comment.map(this.createComment).join(", ");
    this._progressPercentage = `${Math.round(progressManagerProgress.progress * 100)}%`;
  }

  createComment(comment: ProgressManagerComment) {
    return this.i18next.t(`ui:resource_type_accusative_${comment.resourceType}_count`, {
      count: comment.resourceQuantity,
    });
  }

  render() {
    if (!this._progressComment || !this._progressPercentage) {
      return (
        <main id="loading-progress">
          <div id="comment">{this.i18next.t("ui:loading")} ...</div>
        </main>
      );
    }

    return (
      <main id="loading-progress">
        <div id="comment">
          {this.i18next.t("ui:loading")} {this._progressComment} ...
        </div>
        <div id="progress-value">{this._progressPercentage}</div>
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
