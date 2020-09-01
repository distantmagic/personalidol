import type { UIState } from "./UIState.type";

type UIStateMessageRoutes = {
  [key in keyof UIState]: (uiComponentState: UIState[key]) => void;
};

/**
 * This function creates routes to be used with a message channel. It just
 * updates the state to be rendered later.
 */
export function createUIStateMessageRoutes(uiState: UIState): UIStateMessageRoutes {
  const ret: any = {};

  (Object.keys(uiState) as Array<keyof UIState>).forEach(function <ComponentKey extends keyof UIState>(componentKey: ComponentKey) {
    ret[componentKey] = function (uiComponentState: UIState[ComponentKey]): void {
      uiState[componentKey] = uiComponentState;
    };
  });

  return ret as UIStateMessageRoutes;
}
