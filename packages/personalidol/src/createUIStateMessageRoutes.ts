import type { UIState } from "./UIState.type";

type UIStateMessageRoutes = {
  [key in keyof UIState]: (uiComponentState: UIState[key]) => void;
};

type UpdateCallback = () => void;

export function createUIStateMessageRoutes(uiState: UIState, updateCallback: UpdateCallback): UIStateMessageRoutes {
  const ret: any = {};

  (Object.keys(uiState) as Array<keyof UIState>).forEach(function <ComponentKey extends keyof UIState>(componentKey: ComponentKey) {
    ret[componentKey] = function (uiComponentState: UIState[ComponentKey]): void {
      uiState[componentKey] = uiComponentState;
      updateCallback();
    };
  });

  return ret as UIStateMessageRoutes;
}
