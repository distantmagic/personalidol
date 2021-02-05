import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
// import { Input } from "@personalidol/framework/src/Input";
// import { must } from "@personalidol/framework/src/must";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

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
    z-index: 100;
  }

  #pointer {
    pointer-events: none;
    position: absolute;
    transform:
      translate(var(--translate-x), var(--translate-y))
    ;
    will-change: transform, z-index;
  }
`;

export class MousePointerLayerDOMElementView extends DOMElementView {
  constructor() {
    super();

    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  needsRender(): true {
    return true;
  }

  render() {
    return <div />;
    // return (
    //   <div id="mouse-pointer-layer">
    //     <img
    //       id="pointer"
    //       style={{
    //         "--translate-x": `${this.inputState[Input.code.M_RELATIVE_X]}px`,
    //         "--translate-y": `${this.inputState[Input.code.M_RELATIVE_Y]}px`,
    //       }}
    //       src={`${__ASSETS_BASE_PATH}/website/icon-observe.png`}
    //     />
    //   </div>
    // );
  }
}
