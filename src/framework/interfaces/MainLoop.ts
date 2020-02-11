import ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import ControlToken from "src/framework/interfaces/ControlToken";
import Scheduler from "src/framework/interfaces/Scheduler";

export default interface MainLoop extends ControllableDelegate {
  start(controlToken: ControlToken): void;

  stop(controlToken: ControlToken): void;
}
