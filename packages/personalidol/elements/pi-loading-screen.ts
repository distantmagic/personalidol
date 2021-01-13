import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { shadowAttachStylesheet } from "@personalidol/dom-renderer/src/shadowAttachStylesheet";

import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";

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

const _html = `
  <main id="loading-progress">
    <div id="comment"></div>
    <div id="progress-value"></div>
    <div id="progress-indicator">
      <div id="progress-bar" />
    </div>
  </main>
`;

export class LoadingScreen extends HTMLElement {
  static readonly defineName: "pi-loading-screen" = "pi-loading-screen";
  static readonly observedAttributes = ["progress-comment", "progress-value"];

  private _comment: HTMLElement;
  private _progressBar: HTMLElement;
  private _progressValue: HTMLElement;

  set progressManagerProgress(progressManagerProgress: ProgressManagerProgress) {
    const progress = Math.round(progressManagerProgress.progress * 100);
    const progressPercentage: string = `${progress}%`;

    this._progressBar.style.width = progressPercentage;
    this._progressValue.textContent = progressPercentage;

    this._comment.textContent = `Loading ${progressManagerProgress.comment} ...`;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadow.innerHTML = _html;
    shadowAttachStylesheet(shadow, _css);

    this._comment = getHTMLElementById(shadow, "comment");
    this._progressBar = getHTMLElementById(shadow, "progress-bar");
    this._progressValue = getHTMLElementById(shadow, "progress-value");
  }
}
