import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { must } from "@personalidol/framework/src/must";
import { shadowAttachStylesheet } from "@personalidol/dom-renderer/src/shadowAttachStylesheet";

import { ERROR_UI_STATE_NOT_SET, ERROR_UI_UPDATE_CALLBACK_NOT_SET } from "../src/constants";

import type { UIState } from "../src/UIState.type";
import type { UIStateUpdateCallback } from "../src/UIStateUpdateCallback.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  main {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    bottom: 0;
    color: black;
    display: flex;
    font-family: "Mukta", sans-serif;
    font-weight: 500;
    justify-content: center;
    left: 0;
    pointer-events: auto;
    position: absolute;
    right: 0;
    top: 0;
  }

  @media (max-width: 768px) {
    main {
      padding: 0;
    }
  }

  @media (min-width: 769px) {
    main {
      padding-left: 4.8rem;
      padding-right: 4.8rem;
    }
  }

  footer {
    justify-content: flex-end;
    display: grid;
  }

  @media (max-width: 468px) {
    footer {
      grid-column-gap: 0.5ch;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 469px) {
    footer {
      grid-column-gap: 1ch;
      grid-template-columns: repeat(3, 10ch);
    }
  }

  footer button {
    align-items: center;
    border: 1px solid black;
    display: flex;
    height: 2rem;
    justify-content: center;
    line-height: 1;
    padding: 0;
  }

  footer button:disabled {
    background-color: lightgray;
    border-color: gray;
    color: gray;
  }

  footer button:enabled {
    background-color: white;
    color: black;
  }

  form {
    align-items: center;
    background-color: white;
    display: grid;
    grid-row-gap: 1.6rem;
    grid-template-rows: 3.2rem repeat(2, 1fr) 2rem;
    height: 100%;
    overflow-y: auto;
    position: relative;
    width: 100%;
  }

  @media (max-width: 468px) {
    form {
      padding: 1.6rem;
    }
  }

  @media (min-width: 469px) {
    form {
      max-height: 80ch;
      max-width: 60ch;
      padding: 3.2rem;
    }
  }

  form fieldset {
    border: 0;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  form h1 {
    font-family: "Almendra", serif;
    font-size: 3.2rem;
    font-variant: small-caps;
    font-weight: normal;
    margin: 0;
  }
`;

const _html = `
  <main>
    <form id="form">
      <h1>Options</h1>
      <fieldset>
        <legend>Graphics</legend>
      </fieldset>
      <fieldset>
        <legend>Sound</legend>
      </fieldset>
      <footer>
        <button disabled>OK</button>
        <button id="button-cancel">Cancel</button>
        <button disabled>Apply</button>
      </footer>
    </form>
  </main>
`;

const _cOptionsDisabled = Object.freeze({
  enabled: false,
  props: {},
});

function _onSubmit(evt: Event) {
  evt.preventDefault();
}

export class Options extends HTMLElement {
  static readonly defineName: "pi-options" = "pi-options";

  onUINeedsUpdate: null | UIStateUpdateCallback = null;
  uiState: null | UIState = null;

  private _buttonCancel: HTMLButtonElement;
  private _form: HTMLFormElement;

  constructor() {
    super();

    this.onButtonCancelClick = this.onButtonCancelClick.bind(this);

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadow.innerHTML = _html;
    shadowAttachStylesheet(shadow, _css);

    this._buttonCancel = getHTMLElementById(shadow, "button-cancel") as HTMLButtonElement;
    this._form = getHTMLElementById(shadow, "form") as HTMLFormElement;
  }

  connectedCallback() {
    this._buttonCancel.addEventListener("click", this.onButtonCancelClick);
    this._form.addEventListener("submit", _onSubmit);
  }

  disconnectedCallback() {
    this._buttonCancel.removeEventListener("click", this.onButtonCancelClick);
    this._form.removeEventListener("submit", _onSubmit);
  }

  onButtonCancelClick() {
    must(this.uiState, ERROR_UI_STATE_NOT_SET)["pi-options"] = _cOptionsDisabled;
    must(this.onUINeedsUpdate, ERROR_UI_UPDATE_CALLBACK_NOT_SET)();
  }
}
