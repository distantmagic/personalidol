import { MathUtils } from "three/src/math/MathUtils";

import type { Simulant } from "@personalidol/framework/src/Simulant.interface";
import type { SimulantState } from "@personalidol/framework/src/SimulantState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

export function CharacterSimulant(): Simulant {
  const state: SimulantState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isMountable: true,
    isPreloadable: true,
    isSimulant: true,
    name: "CharacterSimulant",
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
