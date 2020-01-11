import { InputDeviceState } from "./InputDeviceState";
import { KeyboardButtonNames } from "../types/KeyboardButtonNames";

export interface KeyboardState extends InputDeviceState<KeyboardButtonNames> {
  isArrowPressed(): boolean;
}
