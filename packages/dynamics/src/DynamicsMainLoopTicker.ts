import type { MainLoopTicker } from "@personalidol/framework/src/MainLoopTicker.interface";
import type { MainLoopTickerState } from "@personalidol/framework/src/MainLoopTickerState.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

/**
 * This ticker aims to keep any number of updates with stricty the same delta.
 * It's good for physics, but bad for animations.
 *
 * See more here:
 * http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
 */
export function DynamicsMainLoopTicker(simulationTimestep: number = 1 / 60, panicThreshold = 300): MainLoopTicker {
  const state: MainLoopTickerState = Object.seal({
    scheduledUpdates: 0,
  });

  const tickTimerState: TickTimerState = Object.seal({
    currentTick: 0,
    delta: 0,
    elapsedTime: 0,
  });

  let _frameDelta: number = 0;

  function tick(delta: number, elapsedTime: number): void {
    _frameDelta += delta;

    if (_frameDelta < simulationTimestep) {
      return;
    }

    tickTimerState.currentTick += 1;
    tickTimerState.delta = delta;
    tickTimerState.elapsedTime = elapsedTime;

    state.scheduledUpdates = Math.floor(_frameDelta / simulationTimestep);

    if (state.scheduledUpdates > panicThreshold) {
      throw new Error("Main loop updates are piling up.");
    }

    _frameDelta -= state.scheduledUpdates * simulationTimestep;
  }

  return Object.freeze({
    state: state,
    tickTimerState: tickTimerState,

    tick: tick,
  });
}
