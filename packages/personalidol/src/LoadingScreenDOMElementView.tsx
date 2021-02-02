import { h } from "preact";

import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { DOMElementRenderingContext } from "@personalidol/dom-renderer/src/DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextState } from "@personalidol/dom-renderer/src/DOMElementRenderingContextState.type";
import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";
// import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

const _css = `
  #comment,
  #progress-value,
  #progress-indicator {
    position: absolute;
    line-height: 1rem;
  }

  #comment,
  #progress-indicator {
    left: 1.6rem;
  }

  #comment,
  #progress-value {
    color: #eeeeee;
    bottom: 2.4rem;
    font-family: sans-serif;
    font-size: 1rem;
    font-variant: small-caps;
    grid-template-columns: auto auto;
    letter-spacing: 0.1ch;
    text-transform: lowercase;
  }

  #comment {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 6.4rem);
  }

  #progress-value {
    font-size: 0.8rem;
    right: 1.6rem;
    text-align: right;
  }

  #progress-indicator,
  #progress-bar {
    height: 0.2rem;
  }

  #progress-indicator {
    align-items: center;
    background-color: #333333;
    bottom: 1.6rem;
    display: grid;
    width: calc(100% - 3.2rem);
  }

  #progress-bar {
    background-color: #eeeeee;
    color: transparent;
    display: block;
    transition: width 0.1s ease-in-out;
    will-change: width;
  }
`;

export function LoadingScreenDOMElementView(
  id: string,
  shadow: ShadowRoot,
): DOMElementRenderingContext {
  const name: string = "LoadingScreenDOMElementView";
  const state: DOMElementRenderingContextState = Object.seal({
    needsRender: false,
    styleSheet: ReplaceableStyleSheet(shadow, _css, name),
  });

  let _progressManagerProgress: null | ProgressManagerProgress = null;

  function beforeRender(props: DOMElementProps) {
    _progressManagerProgress = props.progressManagerProgress;
    state.needsRender = true;
  }

  function render() {
    if (!_progressManagerProgress) {
      return (
        <main id="loading-progress">
          <div id="comment">
            Loading ...
          </div>
        </main>
      );
    }

    const progress = Math.round(_progressManagerProgress.progress * 100);
    const progressPercentage: string = `${progress}%`;

    return (
      <main id="loading-progress">
        <div id="comment">
          Loading {_progressManagerProgress.comment} ...
        </div>
        <div id="progress-value"></div>
        <div id="progress-indicator">
          <div
            id="progress-bar"
            style={{
              width: progressPercentage
            }}
          >{progressPercentage}</div>
        </div>
      </main>
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
