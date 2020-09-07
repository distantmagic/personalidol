import { Vector2 } from "three/src/math/Vector2";

import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { getPrimaryPointerClientX } from "@personalidol/framework/src/getPrimaryPointerClientX";
import { getPrimaryPointerClientY } from "@personalidol/framework/src/getPrimaryPointerClientY";
import { getPrimaryPointerDownInitialClientX } from "@personalidol/framework/src/getPrimaryPointerDownInitialClientX";
import { getPrimaryPointerDownInitialClientY } from "@personalidol/framework/src/getPrimaryPointerDownInitialClientY";
import { Input } from "@personalidol/framework/src/Input";
import { isPrimaryPointerPressed } from "@personalidol/framework/src/isPrimaryPointerPressed";
import { shadowAttachStylesheet } from "@personalidol/dom-renderer/src/shadowAttachStylesheet";

import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #pointer-feedback {
    pointer-events: none;
    position: absolute;
    will-change: height, width;
  }
`;

const _html = `
  <canvas id="pointer-feedback"></canvas>
`;

export class PointerFeedback extends HTMLElement implements MainLoopUpdatable {
  static readonly defineName: "pi-pointer-feedback" = "pi-pointer-feedback";

  private _canvas: HTMLCanvasElement;
  private _canvasContext2D: CanvasRenderingContext2D;
  private _dimensionsState: null | Uint32Array = null;
  private _inputState: null | Int32Array = null;
  private _lastUpdateFromDimensions: number = -1;
  private _lastUpdateFromInput: number = -1;
  private _pointerFeedbackVector: IVector2 = new Vector2();

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadow.innerHTML = _html;
    shadowAttachStylesheet(shadow, _css);

    this._canvas = getHTMLElementById(shadow, "pointer-feedback") as HTMLCanvasElement;

    const canvasContext2D = this._canvas.getContext("2d");

    if (!canvasContext2D) {
      throw new Error("Unable to get canvas rendering context.");
    }

    this._canvasContext2D = canvasContext2D;
  }

  connectedCallback() {
    console.log("PointerFeedback", "connectedCallback");
    console.log(this._canvas.transferControlToOffscreen);
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
      this._canvas.setAttribute("height", this._dimensionsState[Dimensions.code.D_HEIGHT]);
      this._canvas.setAttribute("width", this._dimensionsState[Dimensions.code.D_WIDTH]);
    }

    if (!isPrimaryPointerPressed(this._inputState)) {
      return;
    }

    this._canvasContext2D.beginPath();
    this._canvasContext2D.moveTo(getPrimaryPointerDownInitialClientX(this._inputState), getPrimaryPointerDownInitialClientY(this._inputState));
    this._canvasContext2D.lineTo(getPrimaryPointerClientX(this._inputState), getPrimaryPointerClientY(this._inputState));
    this._canvasContext2D.stroke();

    // this._svg.classList.add("active");
    // this._svg.classList.remove("inactive");

    // const x1 = getPrimaryPointerDownInitialClientX(this._inputState);
    // const y1 = getPrimaryPointerDownInitialClientY(this._inputState);
    // const x2 = getPrimaryPointerClientX(this._inputState);
    // const y2 = getPrimaryPointerClientY(this._inputState);

    // this._pointerFeedbackVector.x = x2 - x1;
    // this._pointerFeedbackVector.y = y2 - y1;
    // this._pointerFeedbackVector.clampLength(0, 100);

    // this._svgCircle.setAttribute("cx", String(x1));
    // this._svgCircle.setAttribute("cy", String(y1));
    // this._svgCircle.setAttribute("r", String(110));

    // this._svgLine.setAttribute("x1", String(x1));
    // this._svgLine.setAttribute("y1", String(y1));

    // this._svgLine.setAttribute("x2", String(x1 + this._pointerFeedbackVector.x));
    // this._svgLine.setAttribute("y2", String(y1 + this._pointerFeedbackVector.y));
  }
}
