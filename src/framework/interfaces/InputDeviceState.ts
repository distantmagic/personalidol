import type Observer from "src/framework/interfaces/Observer";

export default interface InputDeviceState<Buttons extends string> extends Observer {
  isPressed(buttons: Buttons): boolean;

  reset(): void;
}
