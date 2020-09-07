import type { UIComponentRoutes } from "./UIComponentRoutes.type";
import type { UIState } from "./UIState.type";

export function createUIRenderingRouter(uiState: UIState, uiComponentRoutes: UIComponentRoutes) {
  // Storing keys here also has a benefit of keeping keys in the same rendering
  // order always. Objects SHOULD not change key order during the runtime, but
  // with frontend coding nothing is ever certain.
  const uiStateKeys: Array<keyof UIState> = Object.keys(uiState) as Array<keyof UIState>;

  return function createUIComponents(): Array<HTMLElement> {
    const ret: Array<HTMLElement> = [];

    uiStateKeys.forEach(function <ComponentKey extends keyof UIState>(componentKey: ComponentKey) {
      if ("function" !== typeof uiComponentRoutes[componentKey]) {
        throw new Error(`Component has no rendering callback assigned: "${componentKey}"`);
      }

      const uiComponentState: UIState[ComponentKey] = uiState[componentKey];

      if (uiComponentState.enabled) {
        // @ts-ignore
        ret.push(uiComponentRoutes[componentKey](uiComponentState.props));
      }
    });

    return ret;
  };
}
