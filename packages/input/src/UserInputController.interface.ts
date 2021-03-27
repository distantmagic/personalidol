import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";

import type { UserInputControllerState } from "./UserInputControllerState.type";

export interface UserInputController extends MainLoopUpdatable, Mountable, Pauseable {
  readonly state: UserInputControllerState;
  readonly isUserInputController: true;
}
