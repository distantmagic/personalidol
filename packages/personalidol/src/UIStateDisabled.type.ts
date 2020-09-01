import type { UIDisabledComponentState } from "./UIDisabledComponentState.type";
import type { UIStateEnabled } from "./UIStateEnabled.type";

export type UIStateDisabled = {
  [key in keyof UIStateEnabled]: UIDisabledComponentState;
};
