import type { UIStateEnabled } from "./UIStateEnabled.type";

type UIDisabledComponentState = {
  enabled: false;
  props: {};
};

export type UIStateDisabled = {
  [key in keyof UIStateEnabled]: UIDisabledComponentState;
};
