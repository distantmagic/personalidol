import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementView } from "./DOMElementView.interface";

export function initializeDOMElementView<U extends UserSettings>(
  domElementView: DOMElementView<U>,
  userSettings: U,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  uiMessagePort: MessagePort
) {
  domElementView.domMessagePort = domMessagePort;
  domElementView.inputState = inputState;
  domElementView.uiMessagePort = uiMessagePort;
  domElementView.userSettings = userSettings;
}
