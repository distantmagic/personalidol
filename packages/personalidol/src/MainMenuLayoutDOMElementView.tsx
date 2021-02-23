import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { DOMZIndex } from "./DOMZIndex.enum";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #main-menu {
    bottom: 0;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-user-select: none;
    user-select: none;
    z-index: ${DOMZIndex.MainMenu};
    align-items: flex-start;
    color: white;
    display: grid;
    font-size: 1.6rem;
    height: 100%;
    pointer-events: auto;
  }

  #main-menu__content {
    align-items: center;
    display: grid;
    height: 100%;
    overflow-y: auto;
    padding: 1.6rem;
    position: relative;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    #main-menu {
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      left: 0;
    }

    #main-menu__content {
      width: 100%;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    #main-menu {
      justify-content: flex-start;
      left: 3.2rem;
    }

    #main-menu__content {
      background-color: rgba(0, 0, 0, 0.8);
      width: 400px;
    }
  }

  header {
    align-self: flex-end;
  }

  h1,
  h2 {
    font-family: "Almendra", sans-serif;
    line-height: 1;
    margin: 0;
    text-align: center;
  }

  h1 {
    font-size: 3.2rem;
    font-weight: normal;
    letter-spacing: -0.1ch;
    margin: 0;
  }

  h2 {
    font-size: 1.4rem;
    font-variant: small-caps;
    text-transform: lowercase;
    word-spacing: 0.6ch;
  }

  nav {
    align-self: flex-start;
    display: grid;
    padding-top: 3.2rem;
    width: 100%;
  }
`;

export class MainMenuLayoutDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  render() {
    return (
      <div id="main-menu">
        <div id="main-menu__content">
          <header>
            <h1>Personal Idol</h1>
            <h2>You shall not be judged</h2>
          </header>
          <nav>
            <slot />
          </nav>
        </div>
      </div>
    );
  }
}
