import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { GameState } from "./GameState.type";

export interface GameStateController extends MainLoopUpdatable, Service {
  gameState: GameState;
}
