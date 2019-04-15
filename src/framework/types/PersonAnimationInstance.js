// @flow

import type { FSMDefaultStateMachineInstance } from "./FSMDefaultStateMachineInstance";
import type { PersonAnimationStates } from "./PersonAnimationStates";
import type { PersonAnimationTransitions } from "./PersonAnimationTransitions";

export type PersonAnimationInstance = FSMDefaultStateMachineInstance<
  PersonAnimationStates,
  PersonAnimationTransitions
>;
