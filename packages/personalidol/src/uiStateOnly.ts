import { uiDisabledState } from "./uiDisabledState";

import type { UIState } from "./UIState.type";

export function uiStateOnly<Keys extends keyof UIState>(uiState: Pick<UIState, Keys>): UIState {
  return Object.assign({}, uiDisabledState, uiState);
}
