import type Controllable from "src/framework/interfaces/Controllable";

export default interface ControllableDelegate {
  getControllable(): Controllable;
}
