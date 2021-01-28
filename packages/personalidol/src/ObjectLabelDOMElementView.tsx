import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }
`;

export class ObjectLabelDOMElementView extends DOMElementView {
  constructor() {
    super();

    this.nameable.name = "ObjectLabelDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  render() {
    return (
      <div>
        LABEL
      </div>
    );
  }
}
