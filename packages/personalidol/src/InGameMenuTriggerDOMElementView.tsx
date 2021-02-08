import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
// import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #ingame-menu-trigger {
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    position: absolute;
    right: 1.6rem;
    top: 1.6rem;
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
    return (
      <button id="ingame-menu-trigger" onClick={this.onInGameMenuTriggerClick}>
        menu
      </button>
    );
  }
}
