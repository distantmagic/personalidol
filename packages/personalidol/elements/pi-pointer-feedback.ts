// import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { getPrimaryPointerClientX } from "@personalidol/framework/src/getPrimaryPointerClientX";
import { getPrimaryPointerClientY } from "@personalidol/framework/src/getPrimaryPointerClientY";
import { getPrimaryPointerDownInitialClientX } from "@personalidol/framework/src/getPrimaryPointerDownInitialClientX";
import { getPrimaryPointerDownInitialClientY } from "@personalidol/framework/src/getPrimaryPointerDownInitialClientY";
import { getSVGElementById } from "@personalidol/framework/src/getSVGElementById";
import { Input } from "@personalidol/framework/src/Input";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { shadowAttachCSSHTML } from "@personalidol/dom-renderer/src/shadowAttachCSSHTML";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";

declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface IntrinsicElements {
      "pi-pointer-feedback": {};
    }
  }
}

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #pointer-feedback {
    position: absolute;
  }

  #pointer-feedback.active {
  }

  #pointer-feedback.inactive {
    display: none;
  }

  #pointer-feedback-line {
    stroke: red;
    stroke-linecap: round;
    stroke-width: 10px;
  }
`;

const _html = `
  <svg id="pointer-feedback">
    <line id="pointer-feedback-line"></line>
  </svg>
`;

export class PointerFeedback extends HTMLElement implements MainLoopUpdatable {
  private _dimensionsState: null | Uint32Array = null;
  private _inputState: null | Int32Array = null;
  private _lastUpdateFromDimensions: number = -1;
  private _lastUpdateFromInput: number = -1;
  private _svg: SVGElement;
  private _svgLine: SVGLineElement;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadowAttachCSSHTML(shadow, _css, _html);

    this._svg = getSVGElementById(shadow, "pointer-feedback");
    this._svgLine = getSVGElementById(shadow, "pointer-feedback-line") as SVGLineElement;
  }

  connectedCallback() {
    console.log("PointerFeedback", "connectedCallback");
  }

  disconnectedCallback() {
    console.log("PointerFeedback", "disconnectedCallback");
  }

  setDimensionsState(dimensionsState: Uint32Array) {
    this._dimensionsState = dimensionsState;
  }

  setInputState(inputState: Int32Array) {
    this._inputState = inputState;
  }

  update() {
    if (!this._inputState || !this._dimensionsState) {
      return;
    }

    const dimensionsOutdated = this._lastUpdateFromDimensions < this._dimensionsState[Dimensions.code.LAST_UPDATE];
    const inputOutdated = this._lastUpdateFromInput < this._inputState[Input.code.LAST_UPDATE];

    if (!dimensionsOutdated && !inputOutdated) {
      return;
    }

    this._lastUpdateFromDimensions = this._dimensionsState[Dimensions.code.LAST_UPDATE];
    this._lastUpdateFromInput = this._inputState[Input.code.LAST_UPDATE];

    if (dimensionsOutdated) {
      this._svg.setAttribute("viewBox", `0 0 ${this._dimensionsState[Dimensions.code.D_WIDTH]} ${this._dimensionsState[Dimensions.code.D_HEIGHT]}`);
    }

    if (!isPrimaryPointerPressed(this._inputState)) {
      this._svg.classList.remove("active");
      this._svg.classList.add("inactive");

      return;
    }

    this._svg.classList.add("active");
    this._svg.classList.remove("inactive");

    this._svgLine.setAttribute("x1", String(getPrimaryPointerDownInitialClientX(this._inputState)));
    this._svgLine.setAttribute("y1", String(getPrimaryPointerDownInitialClientY(this._inputState)));

    this._svgLine.setAttribute("x2", String(getPrimaryPointerClientX(this._inputState)));
    this._svgLine.setAttribute("y2", String(getPrimaryPointerClientY(this._inputState)));
  }
}
