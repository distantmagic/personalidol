// @flow strict

import type { Observer } from "./Observer";

export interface InputDeviceState<Buttons: string> extends Observer {
  isPressed(Buttons): boolean;

  reset(): void;
}
