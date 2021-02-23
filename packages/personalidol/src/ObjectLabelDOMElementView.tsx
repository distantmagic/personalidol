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
    opacity: var(--opacity);
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: absolute;
    top: 0;
    transform:
      translate(-50%, -100%)
      translate(var(--translate-x), var(--translate-y))
    ;
    will-change: transform, z-index;
    z-index: var(--z-index);
  }
`;

type LabelProps = DOMElementProps & {
  label: string;
};

export class ObjectLabelDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;

  public _objectProps: LabelProps = {
    label: "",
  };

  public _rendererState: CSS2DObjectState = {
    cameraFar: 0,
    distanceToCameraSquared: 0,
    translateX: 0,
    translateY: 0,
    visible: false,
    zIndex: 0,
  };

  private _currentOpacity: number = 1;
  private _targetOpacity: number = 1;

  set objectProps(objectProps: LabelProps) {
    this.needsRender = true;
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
          "--translate-x": `${this._rendererState.translateX}px`,
          "--translate-y": `${this._rendererState.translateY}px`,
          "--opacity": this._currentOpacity,
          "--z-index": this._rendererState.zIndex,
        }}
      >
        {this._objectProps.label}
      </div>
    );
  }
}
