import { uiDisabledState } from "./uiDisabledState";

import type { UIState } from "./UIState.type";

export function createUIState(): UIState {
  return Object.assign({}, uiDisabledState);
}
