import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";

export interface ScriptedBlockController extends MainLoopUpdatable, Nameable {
  readonly isScriptedBlockController: true;
}
