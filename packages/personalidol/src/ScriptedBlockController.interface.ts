import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";

import type { ScriptedBlockControllerState } from "./ScriptedBlockControllerState.type";

export interface ScriptedBlockController extends MainLoopUpdatable, Pauseable {
  readonly isExpectingTargets: boolean;
  readonly isScriptedBlockController: true;
  readonly state: ScriptedBlockControllerState;
}
