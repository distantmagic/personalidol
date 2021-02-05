import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
// import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import { preloadedContent } from "./preloadedContent";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #ingame-menu-trigger {
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    background-image: url('${preloadedContent["assets_website_icon-cogs"]}');
    background-position: center;
    background-repeat: no-repeat;
    border: none;
    color: transparent;
    cursor: pointer;
    height: 40px;
    outline: none;
    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
    width: 64px;
  }

  #ingame-menu-trigger:pressed {
    color: transparent;
  }
`;

export class InGameMenuTriggerDOMElementView extends DOMElementView {
  constructor() {
    super();

    this.onInGameMenuTriggerClick = this.onInGameMenuTriggerClick.bind(this);

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  onInGameMenuTriggerClick(evt: MouseEvent) {
    evt.preventDefault();

    console.log("click");

    // must(this.uiMessagePort).postMessage({
    //   navigateToMap: "map-gates",
    // });
  }

  render() {
    return <button id="ingame-menu-trigger" onClick={this.onInGameMenuTriggerClick} />;
  }
}
