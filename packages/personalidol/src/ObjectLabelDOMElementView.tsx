import { h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import type { CSS2DObjectState } from "@personalidol/three-renderer/src/CSS2DObjectState.type";
import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  #label {
    background-color: rgba(0, 0, 0, 0.6);
    color: #eee;
    font-family: Mukta;
    font-size: 1rem;
    left: 0;
    line-height: 1;
    padding: 1ch;
    position: absolute;
    top: 0;
    will-change: transform, z-index;
  }
`;

type LabelProps = DOMElementProps & {
  label: string;
};

export class ObjectLabelDOMElementView extends DOMElementView {
  objectProps: LabelProps = {
    label: "",
  };
  rendererState: CSS2DObjectState = {
    distanceToCameraSquared: 0,
    translateX: 0,
    translateY: 0,
    visible: false,
    zIndex: 0,
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

  render() {
    if (!this.rendererState.visible) {
      return null;
    }

    return (
      <div
        id="label"
        style={{
          transform: `translate(-50%, -100%) translate(${this.rendererState.translateX}px, ${this.rendererState.translateY}px)`,
          zIndex: this.rendererState.zIndex,
        }}
      >
        {this.objectProps.label}
      </div>
    );
  }
}
