import classnames from "classnames";
import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { isMousePointerInDimensionsBounds } from "@personalidol/framework/src/isMousePointerInDimensionsBounds";
import { isPointerInitiatedByRootElement } from "@personalidol/framework/src/isPointerInitiatedByRootElement";
import { isPrimaryMouseButtonPressed } from "@personalidol/framework/src/isPrimaryMouseButtonPressed";
import { MouseIndices } from "@personalidol/framework/src/MouseIndices.enum";

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

  .mouse-pointer-layer,
  .pointer,
  .pointer__stretch-indicator {
    pointer-events: none;
  }

  .mouse-pointer-layer {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .pointer {
    display: none;
    height: 200px;
    position: absolute;
    transform:
      translate3D(-50%, -50%, 0)
      translate3D(var(--translate-x), var(--translate-y), 0)
    ;
    width: 200px;
    will-change: transform, z-index;
    z-index: ${DOMZIndex.InGameMousePointerGadgets};
  }

  .pointer.pointer--in-bounds.pointer--is-pressed {
    /* display: block; */
  }

  .pointer__stretch-indicator {
    fill: none;
    stroke: white;
    stroke-width: 2;
  }
`;

export class MousePointerLayerDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  beforeRender(): void {
    this.needsRender = true;
  }

  render() {
    return (
      <div class="mouse-pointer-layer">
        <svg
          class={classnames("pointer", {
            "pointer--in-bounds": isMousePointerInDimensionsBounds(this.dimensionsState, this.mouseState),
            "pointer--is-pressed": isPrimaryMouseButtonPressed(this.mouseState) && isPointerInitiatedByRootElement(this.mouseState, this.touchState),
          })}
          style={{
            "--translate-x": `${this.mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_X]}px`,
            "--translate-y": `${this.mouseState[MouseIndices.M_DOWN_INITIAL_CLIENT_Y]}px`,
          }}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle class="pointer__stretch-indicator" cx="50" cy="50" r="49" />
          <line x1="50" y1="50" x2="100" y2="20" stroke="red" />
        </svg>
      </div>
    );
  }
}
