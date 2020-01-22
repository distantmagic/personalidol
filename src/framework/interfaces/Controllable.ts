import ControlToken from "src/framework/interfaces/ControlToken";

export default interface Controllable {
  cedeControlToken(controlToken: ControlToken): void;

  isControlled(): boolean;

  isControlledBy(controlToken: ControlToken): boolean;

  obtainControlToken(): ControlToken;
}
