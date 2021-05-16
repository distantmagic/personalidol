import type { i18n } from "i18next";

import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMElementViewBuilder as IDOMElementViewBuilder } from "./DOMElementViewBuilder.interface";

export function DOMElementViewBuilder<U extends UserSettings>(
  i18next: i18n,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  gameMessagePort: MessagePort,
  uiMessagePort: MessagePort,
  userSettings: U
): IDOMElementViewBuilder<U> {
  function initialize(domElementView: DOMElementView<U>, domMessagePort: MessagePort): void {
    domElementView.dimensionsState = dimensionsState;
    domElementView.domMessagePort = domMessagePort;
    domElementView.gameMessagePort = gameMessagePort;
    domElementView.i18next = i18next;
    domElementView.keyboardState = keyboardState;
    domElementView.mouseState = mouseState;
    domElementView.touchState = touchState;
    domElementView.uiMessagePort = uiMessagePort;
    domElementView.userSettings = userSettings;
  }

  return Object.freeze({
    initialize: initialize,
  });
}
