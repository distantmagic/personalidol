// @flow

import fsm from "../helpers/fsm";

import type { PersonAnimationStates } from "../types/PersonAnimationStates";
import type { PersonAnimationTransitions } from "../types/PersonAnimationTransitions";

export default fsm<PersonAnimationStates, PersonAnimationTransitions>({
  init: "idling",
  transitions: [
    { name: "idle", from: "*", to: "idling" },
    { name: "walk", from: "*", to: "walking" },
    { name: "run", from: "*", to: "running" },
  ],
});
