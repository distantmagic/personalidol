import { GameState as IGameState } from "./GameState.type";

function createEmptyState(): IGameState {
  return {
    currentLocationMap: null,
    currentWorldMap: null,
    isScenePaused: false,
    previousLocationMap: null,
    previousWorldMap: null,
  };
}

export const GameState = Object.freeze({
  createEmptyState: createEmptyState,
});
