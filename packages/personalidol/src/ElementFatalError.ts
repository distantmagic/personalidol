import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { shadowAttachStylesheet } from "@personalidol/dom-renderer/src/shadowAttachStylesheet";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView.interface";
import type { ProgressError } from "@personalidol/loading-manager/src/ProgressError.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

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

  main,
  p,
  pre {
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

  pre {
    overflow-wrap: break-word;
  }
`;

const _html = `
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
    <pre>error while loading <span id="item-resource-type"></span> <span id="item-resource-uri"></span>

    <span id="item-id"></span>

    <span id="error-message"></span>
    <span id="error-stack"></span>
  </main>
`;

export class ElementFatalError extends HTMLElement implements DOMElementView {
  public props: DOMElementProps = {};
  public propsLastUpdate: number = -1;
  public viewLastUpdate: number = -1;

  private _errorMessage: HTMLElement;
  private _errorStack: HTMLElement;
  private _itemId: HTMLElement;
  private _itemResourceType: HTMLElement;
  private _itemResourceUri: HTMLElement;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: "open",
    });

    shadow.innerHTML = _html;
    shadowAttachStylesheet(shadow, _css);

    this._errorMessage = getHTMLElementById(shadow, "error-message");
    this._errorStack = getHTMLElementById(shadow, "error-stack");
    this._itemId = getHTMLElementById(shadow, "item-id");
    this._itemResourceType = getHTMLElementById(shadow, "item-resource-type");
    this._itemResourceUri = getHTMLElementById(shadow, "item-resource-uri");
  }

  update(delta: number, elapsedTime: number, tickTimerState: TickTimerState) {
    if (this.propsLastUpdate < this.viewLastUpdate) {
      return;
    }

    const progressError: undefined | ProgressError = this.props.progressError;

    if (!progressError) {
      return;
    }

    this._errorMessage.textContent = progressError.error.message;
    this._errorStack.textContent = progressError.error.stack;
    this._itemId.textContent = progressError.item.id;
    this._itemResourceType.textContent = progressError.item.resourceType;
    this._itemResourceUri.textContent = progressError.item.resourceUri;

    this.viewLastUpdate = tickTimerState.currentTick;
  }
}
