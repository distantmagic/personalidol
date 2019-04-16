// @flow

import type { InputDeviceState } from "./InputDeviceState";
import type { PointerButtonNames } from "../types/PointerButtonNames";

export interface PointerState extends InputDeviceState<PointerButtonNames> {
  constructor(element: HTMLElement): void;
}
