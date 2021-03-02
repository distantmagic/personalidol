// import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
// import { InputIndices } from "@personalidol/framework/src/InputIndices.enum";

import { DOMZIndex } from "./DOMZIndex.enum";

import type { UserSettings } from "./UserSettings.type";

const _css = `
  :host,
  #mouse-pointer-layer,
  #pointer {
    pointer-events: none;
  }

  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #mouse-pointer-layer {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: ${DOMZIndex.MousePointerLayer};
  }

  #pointer {
    pointer-events: none;
    position: absolute;
    transform: translate3D(var(--translate-x), var(--translate-y), 0);
    will-change: transform, z-index;
  }
`;

export class MousePointerLayerDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  beforeRender(): void {
    this.needsRender = true;
  }

  render() {
    return null;
    // return (
    //   <div id="mouse-pointer-layer">
    //     <div
    //       id="pointer"
    //       style={{
    //         "--translate-x": `${this.inputState[InputIndices.M_RELATIVE_X]}px`,
    //         "--translate-y": `${this.inputState[InputIndices.M_RELATIVE_Y]}px`,
    //       }}
    //     />
    //   </div>
    // );
  }
}
