import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";

import type { MorphBlendMeshTransitionState } from "./MorphBlendMeshTransitionState.type";

export interface MorphBlendMeshTransition extends MainLoopUpdatable {
  readonly state: MorphBlendMeshTransitionState;

  transitionTo(animationName: string): MorphBlendMeshTransition;
}
