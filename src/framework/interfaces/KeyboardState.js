// @flow

import type { InputDeviceState } from "./InputDeviceState";
import type { KeyboardButtonNames } from "../types/KeyboardButtonNames";

export interface KeyboardState extends InputDeviceState<KeyboardButtonNames> {
  isArrowPressed(): boolean;
}
