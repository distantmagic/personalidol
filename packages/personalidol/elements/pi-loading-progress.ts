import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { shadowAttachCSSHTML } from "@personalidol/dom-renderer/src/shadowAttachCSSHTML";

const _css = `
  .loading-progress {
  }

  #comment,
  #progress,
  .progress-bar {
    position: absolute;
    line-height: 1rem;
  }

  #comment,
  .progress-bar {
    left: 1.6rem;
  }

  #comment,
  #progress {
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

  #progress {
    font-size: 0.8rem;
    right: 1.6rem;
    text-align: right;
  }

  .progress-bar,
  .progress-bar__progress {
    height: 0.2rem;
  }

  .progress-bar {
    align-items: center;
    background-color: #333333;
    bottom: 1.6rem;
    display: grid;
    width: calc(100% - 3.2rem);
  }

  .progress-bar__progress {
    background-color: #eeeeee;
    color: transparent;
    display: block;
    width: var(--progress);
    transition: width 0.1s ease-in-out;
  }
`;

const _html = `
  <main class="loading-progress">
    <div id="comment"></div>
    <div id="progress"></div>
    <div class="progress-bar">
      <div class="progress-bar__progress" />
    </div>
  </main>
`;

export class LoadingProgress extends HTMLElement {
  static observedAttributes = ["progress-comment", "progress-value"];

  comment: HTMLElement;
  progress: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadowAttachCSSHTML(shadow, _css, _html);

    this.comment = getHTMLElementById(shadow, "comment");
    this.progress = getHTMLElementById(shadow, "progress");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "progress-comment":
        this.comment.textContent = newValue;
        break;
      case "progress-value":
        const progress = Math.round(parseFloat(newValue) * 100);

        this.style.setProperty("--progress", `${progress}%`);
        this.progress.textContent = `${progress}%`;
        break;
    }
  }
}
