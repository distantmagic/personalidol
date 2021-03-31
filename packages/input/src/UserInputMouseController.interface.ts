import type { UserInputController } from "./UserInputController.interface";
import type { UserInputMouseControllerState } from "./UserInputMouseControllerState.type";

export interface UserInputMouseController extends UserInputController {
  readonly state: UserInputMouseControllerState;
}
