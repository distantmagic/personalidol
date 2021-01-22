import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { shadowAttachStylesheet } from "@personalidol/dom-renderer/src/shadowAttachStylesheet";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementView } from "./DOMElementView.interface";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  .main-menu,
  .main-menu:before {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .main-menu {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    display: grid;
    font-size: 1.6rem;
    justify-content: center;
    height: 100%;
    pointer-events: auto;
  }

  .main-menu__content {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    overflow-y: auto;
    padding: 1.6rem;
    position: relative;
  }

  h1,
  h2,
  nav {
    position: relative;
  }

  h1,
  h2 {
    line-height: 1;
    margin: 0;
    text-align: center;
  }

  h1 {
    font-family: "Almendra", sans-serif;
    font-size: 3.2rem;
    font-weight: normal;
    font-variant: small-caps;
    margin: 0;
  }

  h2,
  nav button {
    font-family: "Mukta", sans-serif;
  }

  h2 {
    font-size: 1.4rem;
    font-variant: small-caps;
    font-weight: 500;
    letter-spacing: 0.05  ch;
    text-transform: lowercase;
    word-spacing: 0.6ch;
  }

  nav {
    align-self: flex-start;
    display: grid;
    padding-top: 3.2rem;
    width: 100%;
  }

  button {
    background-color: transparent;
    border: 1px solid transparent;
    font-family: "Mukta", sans-serif;
    font-size: 1.4rem;
    font-variant: small-caps;
    font-weight: 300;
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
  <div class="main-menu">
    <div class="main-menu__content">
      <h1>Personal Idol</h1>
      <h2>You shall not be judged</h2>
      <nav>
        <button disabled>Continue</button>
        <button id="button-new-game">New Game</button>
        <button disabled>Load Game</button>
        <button disabled>Options</button>
        <button disabled>Credits</button>
      </nav>
    </div>
  </div>
`;

export class ElementMainMenu extends HTMLElement implements DOMElementView {
  public props: DOMElementProps = {};
  public propsLastUpdate: number = -1;
  public viewLastUpdate: number = -1;

  private _buttonNewGame: HTMLButtonElement;

  constructor() {
    super();

    this.onButtonNewGameClick = this.onButtonNewGameClick.bind(this);

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadow.innerHTML = _html;
    shadowAttachStylesheet(shadow, _css);

    this._buttonNewGame = getHTMLElementById(shadow, "button-new-game") as HTMLButtonElement;
  }

  connectedCallback() {
    this._buttonNewGame.addEventListener("click", this.onButtonNewGameClick);
  }

  disconnectedCallback() {
    this._buttonNewGame.removeEventListener("click", this.onButtonNewGameClick);
  }

  onButtonNewGameClick(evt: MouseEvent) {
    console.log("click");
  }

  update(delta: number) {}
}
