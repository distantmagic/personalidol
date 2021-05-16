import { GameState as IGameState } from "./GameState.type";

function createEmptyState(): IGameState {
  return {
    currentLocationMap: null,
    isScenePaused: false,
    previousLocationMap: null,
  };
}

export const GameState = Object.freeze({
  createEmptyState: createEmptyState,
});
