import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { UserSettings } from "./UserSettings.type";

export const css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  button {
    background-color: transparent;
    border: 1px solid transparent;
    font-family: "Mukta", sans-serif;
    font-size: 1.4rem;
    font-variant: small-caps;
    font-weight: 300;
    line-height: 1;
    padding: 0.8rem 1.6rem;
    text-align: center;
    text-transform: lowercase;
    width: 100%;
  }

  button:disabled {
    color: rgba(255, 255, 255, 0.4);
  }

  button:enabled {
    color: white;
    cursor: pointer;
  }

  button:enabled:hover {
    border-color: white;
  }

  button:focus {
    outline: none;
  }
`;

export class MainMenuButtonDOMElementView extends DOMElementView<UserSettings> {
  static get observedAttributes() {
    return ["disabled"];
  }

  public css: string = css;

  private _isDisabled: boolean = false;

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    this.needsRender = true;
    this._isDisabled = "string" === typeof newValue;
  }

  render() {
    return (
      <button disabled={this._isDisabled}>
        <slot />
      </button>
    );
  }
}
