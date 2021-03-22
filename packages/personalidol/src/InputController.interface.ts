import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";

import type { InputControllerState } from "./InputControllerState.type";

export interface InputController extends MainLoopUpdatable, Mountable, Pauseable {
  readonly state: InputControllerState;
  readonly isInputController: true;
}
