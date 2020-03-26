import type ControlToken from "src/framework/interfaces/ControlToken";

export default interface Controllable {
  cedeExternalControlToken(controlToken: ControlToken): void;

  isControlledByAnyExternalToken(): boolean;

  isControlledByExternalToken(controlToken: ControlToken): boolean;

  isControlledByInternalToken(controlToken: ControlToken): boolean;

  obtainControlToken(): ControlToken;
}
