// @flow

import fsm from "../../framework/helpers/fsm";

import type { GameStates } from "../types/GameStates";
import type { GameTransitions } from "../types/GameTransitions";

export default fsm<GameStates, GameTransitions>({
  init: "idling",
  transitions: [
    { name: "idle", from: "*", to: "idling" },
    { name: "walk", from: "*", to: "walking" },
    { name: "run", from: "*", to: "running" },
  ],
});
