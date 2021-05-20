import type { i18n } from "i18next";

import type { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView.interface";
import type { DOMElementViewBuilder as IDOMElementViewBuilder } from "@personalidol/dom-renderer/src/DOMElementViewBuilder.interface";

import type { DOMElementViewContext } from "./DOMElementViewContext.type";

export function DOMElementViewBuilder(context: DOMElementViewContext): IDOMElementViewBuilder<DOMElementViewContext> {
  function initialize(
    domElementView: DOMElementView<DOMElementViewContext>,
    domMessagePort: MessagePort,
    i18next: i18n
  ): void {
    domElementView.context = context;
    domElementView.domMessagePort = domMessagePort;
    domElementView.i18next = i18next;
  }

  return Object.freeze({
    initialize: initialize,
  });
}
