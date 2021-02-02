import { h } from "preact";

import { ReplaceableStyleSheet } from "@personalidol/dom-renderer/src/ReplaceableStyleSheet";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { DOMElementRenderingContext } from "@personalidol/dom-renderer/src/DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextState } from "@personalidol/dom-renderer/src/DOMElementRenderingContextState.type";
import type { ProgressError } from "@personalidol/loading-manager/src/ProgressError.type";

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  h1 {
    font-size: 1rem;
  }

  div,
  main,
  p {
    font-family: monospace;
    font-size: 1rem;
    letter-spacing: 0.1ch;
    line-height: 1.6;
  }

  main {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 1.6rem;
    color: white;
    left: 50%;
    max-width: 80ch;
    overflow-y: auto;
    pointer-events: auto;
    padding: 0.8rem;
    position: absolute;
    user-select: text;
    top: 1.6rem;
    transform: translateX(-50%);
    width: calc(100vw - 3.2rem);
  }

  main p + p {
    margin-top: 1rem;
  }

  #error-report {
    display: grid;
    overflow-wrap: break-word;
  }
`;

export function FatalErrorDOMElementView(
  id: string,
  shadow: ShadowRoot,
): DOMElementRenderingContext {
  const name: string = "FatalErrorDOMElementView";
  const state: DOMElementRenderingContextState = Object.seal({
    needsRender: false,
    styleSheet: ReplaceableStyleSheet(shadow, _css, name),
  });

  let _progressError: null | ProgressError = null;

  function beforeRender(props: DOMElementProps) {
    _progressError = props.progressError;
    state.needsRender = true;
  }

  function render() {
    if (!_progressError) {
      return null;
    }

    return (
      <main>
        <h1>Error</h1>
        <p>
          Unexpected error occurred (yes, there are expected, foreseeable,
            recoverable errors). We are really, really sorry about that.
        </p>
        <p>
          We have automated bug reporting systems, so we most probably will be
          soon aware that this happened and take some appropriate actions to
          mitigate such things in the future.
          It still makes sense to send us this error if you need some personal
          support or want to provide some additional details about your setup.
          Our bug reporting systems do not store any kind of your personal data
          and are not linked in any way to your account, so we can't reach out to
          you even if we wanted to.
        </p>
        <p>
          In the meantime you can try some obvious things like reloading the
          page, checking internet connection, etc. Again, we are really, really,
          really sorry and deeply ashamed about this. If there is anything that
          can bring us peace, it is your forgiveness.
        </p>
        <div id="error-report">
          <span id="item-resource-type">
            resource_type: {_progressError.item.resourceType}
          </span>
          <span id="item-resource-uri">
            resource_uri: {_progressError.item.resourceUri}
          </span>
          <span id="item-id">
            resource_id: {_progressError.item.id}
          </span>
          <span id="error-message">
            resource_error_message: {_progressError.error.message}
          </span>
          <span id="error-stack">
            resource_error_stack: {_progressError.error.stack}
          </span>
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
