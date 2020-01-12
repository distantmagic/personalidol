import { Observer } from "src/framework/interfaces/Observer";

export interface InputDeviceState<Buttons extends string> extends Observer {
  isPressed(buttons: Buttons): boolean;

  reset(): void;
}
