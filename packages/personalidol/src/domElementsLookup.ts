import { ElementFatalError } from "./ElementFatalError";
import { ElementLoadingScreen } from "./ElementLoadingScreen";
import { ElementMainMenu } from "./ElementMainMenu";

import type { DOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

export const domElementsLookup: DOMElementsLookup = {
  "pi-fatal-error": ElementFatalError,
  "pi-loading-screen": ElementLoadingScreen,
  "pi-main-menu": ElementMainMenu,
};
