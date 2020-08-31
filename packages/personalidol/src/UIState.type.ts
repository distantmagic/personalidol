import type { UIStateDisabled } from "./UIStateDisabled.type";
import type { UIStateEnabled } from "./UIStateEnabled.type";

export type UIState = {
  [key in keyof UIStateEnabled]: UIStateDisabled[key] | UIStateEnabled[key];
};
