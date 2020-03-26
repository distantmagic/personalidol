import type KeyboardButtonNames from "src/framework/enums/KeyboardButtonNames";

import type InputDeviceState from "src/framework/interfaces/InputDeviceState";

export default interface KeyboardState extends InputDeviceState<KeyboardButtonNames> {
  isArrowPressed(): boolean;
}
