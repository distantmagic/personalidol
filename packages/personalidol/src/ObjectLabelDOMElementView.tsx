import { h } from "preact";

import { damp } from "@personalidol/framework/src/damp";
import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";

import type { CSS2DObjectState } from "@personalidol/three-renderer/src/CSS2DObjectState.type";
import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

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

  public objectProps: LabelProps = {
    label: "",
  };
  public rendererState: CSS2DObjectState = {
    cameraFar: 0,
    distanceToCameraSquared: 0,
    translateX: 0,
    translateY: 0,
    visible: false,
    zIndex: 0,
  };

  private _opacity = {
    current: 1,
    target: 1,
  };

  render(delta: number) {
    if (!this.rendererState.visible) {
      return null;
    }

    this._opacity.target = this.rendererState.distanceToCameraSquared < this.rendererState.cameraFar * this.rendererState.cameraFar - FADE_OUT_DISTANCE_SQUARED ? 1 : 0.3;
    this._opacity.current = damp(this._opacity.current, this._opacity.target, OPACITY_DAMP, delta);

    return (
      <div
        id="label"
        style={{
          "--translate-x": `${this.rendererState.translateX}px`,
          "--translate-y": `${this.rendererState.translateY}px`,
          "--opacity": this._opacity.current,
          "--z-index": this.rendererState.zIndex,
        }}
      >
        {this.objectProps.label}
      </div>
    );
  }

  updateProps(props: DOMElementProps, tickTimerState: TickTimerState): void {
    super.updateProps(props, tickTimerState);

    this.objectProps = props.objectProps;
    this.rendererState = props.rendererState;
  }
}
