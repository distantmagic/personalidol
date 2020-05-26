import type ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import type ControlToken from "src/framework/interfaces/ControlToken";

export default interface MainLoop extends ControllableDelegate {
  start(controlToken: ControlToken): void;

  stop(controlToken: ControlToken): void;
}
