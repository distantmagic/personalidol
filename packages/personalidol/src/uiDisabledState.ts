import { uiDisabledComponentState } from "./uiDisabledComponentState";

import type { UIStateDisabled } from "./UIStateDisabled.type";

export const uiDisabledState: UIStateDisabled = Object.freeze({
  "pi-main-menu": uiDisabledComponentState,
  "pi-fatal-error": uiDisabledComponentState,
  "pi-loading-screen": uiDisabledComponentState,
  "pi-options": uiDisabledComponentState,
});
