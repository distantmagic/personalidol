// @flow strict

import type { InputDeviceState } from "./InputDeviceState";
import type { PointerButtonNames } from "../types/PointerButtonNames";

export interface PointerState extends InputDeviceState<PointerButtonNames> {}
