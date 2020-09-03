import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { shadowAttachCSSHTML } from "@personalidol/dom-renderer/src/shadowAttachCSSHTML";

declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface IntrinsicElements {
      "pi-main-menu-button": {
        children: string;
        disabled?: undefined | true;
        onClick?: (evt: MouseEvent) => void;
      };
    }
  }
}

const _css = `
  :host {
    all: initial;
  }

  button {
    background-color: transparent;
    border: 1px solid transparent;
    font-family: "Mukta", sans-serif;
    font-size: 1.4rem;
    font-variant: small-caps;
    font-weight: 300;
    // padding-bottom: 0.5rem;
    // padding-top: 0.5rem;
    text-align: center;
    text-transform: lowercase;
    width: 100%;
  }

  button:disabled {
    color: rgba(255, 255, 255, 0.4);
  }

  button:enabled {
    color: white;
  }

  button:enabled:hover {
    border-color: white;
  }

  button:focus {
    outline: none;
  }
`;

const _html = `
  <button id="button">
    <slot></slot>
  </button>
`;

export class MainMenuButton extends HTMLElement {
  static observedAttributes = ["disabled"];

  button: HTMLButtonElement;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadowAttachCSSHTML(shadow, _css, _html);

    this.button = getHTMLElementById(shadow, "button") as HTMLButtonElement;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.button.disabled = newValue === "true";
  }
}
