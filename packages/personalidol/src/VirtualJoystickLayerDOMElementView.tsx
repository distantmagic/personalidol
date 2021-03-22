import clsx from "clsx";
import { h } from "preact";
import { Vector2 } from "three/src/math/Vector2";

import { computePrimaryTouchStretchVector } from "@personalidol/input/src/computePrimaryTouchStretchVector";
import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { getPrimaryTouchInitialClientX } from "@personalidol/input/src/getPrimaryTouchInitialClientX";
import { getPrimaryTouchInitialClientY } from "@personalidol/input/src/getPrimaryTouchInitialClientY";
import { isPrimaryTouchInDimensionsBounds } from "@personalidol/input/src/isPrimaryTouchInDimensionsBounds";
import { isPrimaryTouchInitiatedByRootElement } from "@personalidol/input/src/isPrimaryTouchInitiatedByRootElement";
import { isPrimaryTouchPressed } from "@personalidol/input/src/isPrimaryTouchPressed";

import { DOMZIndex } from "./DOMZIndex.enum";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";

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
  .pointer__stretch-boundary,
  pointer__stretch-indicator {
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
    height: 220px;
    position: absolute;
    transform:
      translate3D(-50%, -50%, 0)
      translate3D(var(--translate-x), var(--translate-y), 0)
    ;
    width: 220px;
    will-change: transform, z-index;
    z-index: ${DOMZIndex.InGameMousePointerGadgets};
  }

  .pointer.pointer--in-bounds.pointer--is-pressed {
  }

  .pointer__stretch-boundary,
  .pointer__stretch-indicator {
    fill: none;
    stroke: rgba(255, 255, 255, 0.3);
    stroke-width: 0.5;
  }
`;

export class VirtualJoystickLayerDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  private _stretchVector: IVector2 = new Vector2();

  beforeRender(): void {
    this.needsRender = true;
  }

  render() {
    const _isInBounds = isPrimaryTouchInDimensionsBounds(this.dimensionsState, this.touchState);
    const _isPressed = isPrimaryTouchPressed(this.touchState);
    const _isInitiatedByRootElement = isPrimaryTouchInitiatedByRootElement(this.touchState);

    if (!_isInBounds || !_isPressed || !_isInitiatedByRootElement) {
      return null;
    }

    computePrimaryTouchStretchVector(this._stretchVector, this.touchState);

    return (
      <div class="mouse-pointer-layer">
        <svg
          class={clsx("pointer", {
            "pointer--in-bounds": _isInBounds,
            "pointer--is-pressed": _isPressed && _isInitiatedByRootElement,
          })}
          style={{
            "--translate-x": `${getPrimaryTouchInitialClientX(this.touchState)}px`,
            "--translate-y": `${getPrimaryTouchInitialClientY(this.touchState)}px`,
          }}
          viewBox="0 0 110 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle class="pointer__stretch-boundary" cx="55" cy="55" r="50" />
          <circle class="pointer__stretch-indicator" cx={55 + 40 * this._stretchVector.x} cy={55 + -40 * this._stretchVector.y} r="10" />
        </svg>
      </div>
    );
  }
}
