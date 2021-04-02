import type { MessageFeedbackSimulantPreloaded } from "@personalidol/dynamics/src/MessageFeedbackSimulantPreloaded.type";
import type { Simulant } from "@personalidol/dynamics/src/Simulant.interface";
import type { SimulantsLookup } from "./SimulantsLookup.type";
import type { SimulantState } from "@personalidol/dynamics/src/SimulantState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

export function WorldspawnGeometrySimulant(id: string, simulantFeedbackMessagePort: MessagePort): Simulant {
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

    simulantFeedbackMessagePort.postMessage({
      preloaded: <MessageFeedbackSimulantPreloaded<SimulantsLookup, "worldspawn-geometry">>{
        id: id,
        simulant: "worldspawn-geometry",
      },
    });

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
    id: id,
    isDisposable: true,
    isMountable: true,
    isPreloadable: true,
    isSimulant: true,
    name: "WorldspawnGeometrySimulant",
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
