import { shadowAttachCSSHTML } from "@personalidol/dom-renderer/src/shadowAttachCSSHTML";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  ::slotted(h1) {
    font-size: 1rem;
  }

  .fatal-error,
  ::slotted(p),
  ::slotted(pre) {
    font-family: monospace;
    font-size: 1rem;
    letter-spacing: 0.1ch;
    line-height: 1.6;
  }

  .fatal-error {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 1.6rem;
    color: white;
    left: 50%;
    max-width: 80ch;
    overflow-y: auto;
    pointer-events: auto;
    padding: 0.8rem;
    position: absolute;
    user-select: text;
    top: 1.6rem;
    transform: translateX(-50%);
    width: calc(100vw - 3.2rem);
  }

  .fatal-error p + p {
    margin-top: 1rem;
  }

  ::slotted(pre) {
    overflow-wrap: break-word;
  }
`;

const _html = `
  <main class="fatal-error">
    <slot name="title"></slot>
    <slot></slot>
    <slot name="technical-description"></slot>
  </main>
`;

export class FatalError extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadowAttachCSSHTML(shadow, _css, _html);
  }
}
