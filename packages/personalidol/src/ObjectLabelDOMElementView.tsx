import { h } from "preact";
import { MathUtils } from "three/src/math/MathUtils";

import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import type { CSS2DObjectState } from "@personalidol/three-renderer/src/CSS2DObjectState.type";
import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { DOMElementRenderingContext } from "@personalidol/dom-renderer/src/DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextState } from "@personalidol/dom-renderer/src/DOMElementRenderingContextState.type";

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

export function ObjectLabelDOMElementView(
  id: string,
  shadow: ShadowRoot,
  uiMessagePort: MessagePort,
): DOMElementRenderingContext {
  const name: string = "ObjectLabelDOMElementView";
  const state: DOMElementRenderingContextState = Object.seal({
    needsRender: true,
    styleSheet: ReplaceableStyleSheet(shadow, _css, name),
  });

  let _objectProps: LabelProps = {
    label: "",
  };

  let _rendererState: CSS2DObjectState = {
    cameraFar: 0,
    distanceToCameraSquared: 0,
    translateX: 0,
    translateY: 0,
    visible: false,
    zIndex: 0,
  };

  const _opacity = {
    current: 1,
    target: 1,
  };

  function beforeRender(props: DOMElementProps) {
    if (!props.objectProps || !props.rendererState) {
      return;
    }

    _objectProps = props.objectProps;
    _rendererState = props.rendererState;

    state.needsRender = true;
  }

  function render(delta: number) {
    if (!_rendererState.visible) {
      return null;
    }

    _opacity.target = _rendererState.distanceToCameraSquared < ((_rendererState.cameraFar * _rendererState.cameraFar) - FADE_OUT_DISTANCE_SQUARED)
      ? 1
      : 0.3
    ;

    _opacity.current = MathUtils.damp(
      _opacity.current,
      _opacity.target,
      OPACITY_DAMP,
      delta
    );

    return (
      <div
        id="label"
        style={{
          '--label-translate-x': `${_rendererState.translateX}px`,
          '--label-translate-y': `${_rendererState.translateY}px`,
          '--label-opacity': _opacity.current,
          '--label-z-index': _rendererState.zIndex,
        }}
      >
        {_objectProps.label}
      </div>
    );
  }

  return Object.freeze({
    id: id,
    isPure: true,
    name: name,
    state: state,

    beforeRender: beforeRender,
    render: render,
  });
}
