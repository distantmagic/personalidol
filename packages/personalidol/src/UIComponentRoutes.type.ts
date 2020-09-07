import type { UIState } from "./UIState.type";
import type { UIStateEnabled } from "./UIStateEnabled.type";

export type UIComponentRoutes = {
  [key in keyof UIState]: (uiComponentState: UIStateEnabled[key]["props"]) => HTMLElement;
};
