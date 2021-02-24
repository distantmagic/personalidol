import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { PauseableState } from "@personalidol/framework/src/PauseableState.type";

export type ScriptedBlockControllerState = MainLoopUpdatableState & PauseableState;
