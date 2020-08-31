import type { ComponentChild } from "preact";

import type { UIComponentRoutes } from "./UIComponentRoutes.type";
import type { UIState } from "./UIState.type";

export function createUIComponentsRouter(uiComponentRoutes: UIComponentRoutes) {
  return function (uiState: UIState): Array<ComponentChild> {
    const ret: Array<ComponentChild> = [];

    (Object.keys(uiState) as Array<keyof UIState>).forEach(function <ComponentKey extends keyof UIState>(componentKey: ComponentKey) {
      if (!uiComponentRoutes.hasOwnProperty(componentKey)) {
        throw new Error(`Unknown component: "${componentKey}"`);
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
