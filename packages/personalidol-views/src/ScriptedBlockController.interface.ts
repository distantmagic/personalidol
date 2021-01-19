import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";

export interface ScriptedBlockController extends MainLoopUpdatable, Nameable {
  readonly isExpectingTargets: boolean;
  readonly isScriptedBlockController: true;
  readonly needsUpdates: boolean;
}
