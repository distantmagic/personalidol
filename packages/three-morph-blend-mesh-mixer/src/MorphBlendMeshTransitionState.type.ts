import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

export type MorphBlendMeshTransitionState = MainLoopUpdatableState & {
  currentAnimation: string;
  targetAnimation: string;
};
