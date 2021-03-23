import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host {
    pointer-events: none;
  }

  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }
`;

export class MousePointerLayerDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  beforeRender(): void {
    this.needsRender = true;
  }

  render() {
    return (
      <div></div>
    );
  }
}
