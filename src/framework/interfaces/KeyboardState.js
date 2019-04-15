// @flow

import type { KeyboardKeyNames } from "../types/KeyboardKeyNames";
import type { Observer } from "./Observer";

export interface KeyboardState extends Observer {
  isArrowPressed(): boolean;

  isPressed(KeyboardKeyNames): boolean;
}
