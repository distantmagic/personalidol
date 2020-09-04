import { uiDisabledComponentState } from "./uiDisabledComponentState";

import type { UIStateDisabled } from "./UIStateDisabled.type";

export const uiDisabledState: UIStateDisabled = Object.freeze({
  cMainMenu: uiDisabledComponentState,
  cLoadingError: uiDisabledComponentState,
  cLoadingScreen: uiDisabledComponentState,
  cOptions: uiDisabledComponentState,
  cPointerFeedback: uiDisabledComponentState,
});
