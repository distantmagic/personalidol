import { h } from "preact";

import { damp } from "@personalidol/framework/src/damp";
import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { CSS2DObjectState } from "@personalidol/three-renderer/src/CSS2DObjectState.type";
import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";

import type { UserSettings } from "./UserSettings.type";

const OPACITY_DAMP = 10;
const FADE_OUT_DISTANCE_SQUARED: number = 4000;

const _css = `
  :host {
    all: initial;
    pointer-events: none;
  }

  *, * * {
    box-sizing: border-box;
  }

  #label {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    align-items: center;
    backface-visibility: hidden;
    background-color: rgba(0, 0, 0, 0.8);
    color: #eee;
    display: flex;
    font-family: Mukta;
    font-size: 1rem;
    height: 2rem;
    justify-content: center;
    left: 0;
    line-height: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: absolute;
    top: 0;
    will-change: opacity, transform, z-index;
  }
`;

type LabelProps = DOMElementProps & {
  label: string;
};

export class ObjectLabelDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  public _objectProps: LabelProps = Object.seal({
    label: "",
  });

  public _rendererState: CSS2DObjectState = Object.seal({
    cameraFar: 0,
    distanceToCameraSquared: 0,
    translateX: 0,
    translateY: 0,
    visible: false,
    zIndex: 0,
  });

  private _currentOpacity: number = 1;
  private _objectLabelTranslated: string = "";
  private _targetOpacity: number = 1;

  set objectProps(objectProps: LabelProps) {
    if (objectProps.label === this._objectProps.label) {
      return;
    }

    this.needsRender = true;
    this._objectLabelTranslated = this.i18next.t(objectProps.label);
    this._objectProps = objectProps;
  }

  set rendererState(rendererState: CSS2DObjectState) {
    this.needsRender = true;
    this._rendererState = rendererState;
  }

  render(delta: number) {
    if (!this._rendererState.visible) {
      return null;
    }

    this._targetOpacity = this._rendererState.distanceToCameraSquared < this._rendererState.cameraFar * this._rendererState.cameraFar - FADE_OUT_DISTANCE_SQUARED ? 1 : 0.3;
    this._currentOpacity = damp(this._currentOpacity, this._targetOpacity, OPACITY_DAMP, delta);

    return (
      <div
        id="label"
        style={{
          opacity: this._currentOpacity,
          transform: `
            translate3D(-50%, -100%, 0)
            translate3D(
              ${this._rendererState.translateX}px,
              ${this._rendererState.translateY}px,
              0
            )
          `,
          "z-index": this._rendererState.zIndex,
        }}
      >
        {this._objectLabelTranslated}
      </div>
    );
  }
}
