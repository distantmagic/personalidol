import InputDeviceState from "src/framework/interfaces/InputDeviceState";

import KeyboardButtonNames from "src/framework/types/KeyboardButtonNames";

export default interface KeyboardState extends InputDeviceState<KeyboardButtonNames> {
  isArrowPressed(): boolean;
}
