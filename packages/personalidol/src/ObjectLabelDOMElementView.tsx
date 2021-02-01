import { h } from "preact";
import { MathUtils } from "three/src/math/MathUtils";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import type { CSS2DObjectState } from "@personalidol/three-renderer/src/CSS2DObjectState.type";
import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

const OPACITY_DAMP = 10;
const FADE_OUT_DISTANCE_SQUARED: number = 4000;

const _css = `
  :host {
    all: initial;
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
    opacity: var(--label-opacity);
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: absolute;
    top: 0;
    transform:
      translate(-50%, -100%)
      translate(var(--label-translate-x), var(--label-translate-y))
    ;
    will-change: transform, z-index;
    z-index: var(--label-z-index);
  }
`;

type LabelProps = DOMElementProps & {
  label: string;
};

export class ObjectLabelDOMElementView extends DOMElementView {
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

  constructor() {
    super();

    this.nameable.name = "ObjectLabelDOMElementView";
    this.styleSheet = ReplaceableStyleSheet(this.shadow, _css);
  }

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    if (!this.props.objectProps || !this.props.rendererState) {
      return;
    }

    this.objectProps = this.props.objectProps;
    this.rendererState = this.props.rendererState;

    this.needsRender = true;
    this.viewLastUpdate = tickTimerState.currentTick;
  }

  render(delta: number) {
    if (!this.rendererState.visible) {
      return null;
    }

    this._opacity.target = this.rendererState.distanceToCameraSquared < ((this.rendererState.cameraFar * this.rendererState.cameraFar) - FADE_OUT_DISTANCE_SQUARED)
      ? 1
      : 0.3
    ;

    this._opacity.current = MathUtils.damp(
      this._opacity.current,
      this._opacity.target,
      OPACITY_DAMP,
      delta
    );

    return (
      <div
        id="label"
        style={{
          '--label-translate-x': `${this.rendererState.translateX}px`,
          '--label-translate-y': `${this.rendererState.translateY}px`,
          '--label-opacity': this._opacity.current,
          '--label-z-index': this.rendererState.zIndex,
        }}
      >
        {this.objectProps.label}
      </div>
    );
  }
}
