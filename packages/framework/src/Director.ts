import { MathUtils } from "three/src/math/MathUtils";

import { dispose } from "./dispose";
import { preload } from "./preload";

import type { Logger } from "loglevel";

import type { Director as IDirector } from "./Director.interface";
import type { DirectorState } from "./DirectorState.type";
import type { Scene } from "./Scene.interface";
import type { TickTimerState } from "./TickTimerState.type";

export function Director(logger: Logger, tickTimerState: TickTimerState, debugName: string): IDirector {
  let transitioning: null | Scene = null;

  const state: DirectorState = Object.seal({
    current: null,
    isStarted: false,
    isTransitioning: false,
    lastUpdateCurrentTick: -1,
    lastUpdateNextTick: -1,
    lastUpdateTransitioningTick: -1,
    needsUpdates: true,
    next: null,

    get transitioning(): null | Scene {
      return transitioning;
    },
  });

  function start(): void {
    if (state.isStarted) {
      throw new Error("Director is already started.");
    }

    state.isStarted = true;
  }

  function stop(): void {
    if (!state.isStarted) {
      throw new Error("Director is already stopped.");
    }

    state.isStarted = false;
  }

  function update(): void {
    if (!state.isStarted) {
      throw new Error("Director is not started, but it was updated.");
    }

    const { current, next } = state;

    // 0,0,0
    if (!next && !transitioning && !current) {
      return;
    }

    // 0,0,1
    if (!next && !transitioning && current) {
      return;
    }

    // 0,1,0
    if (!next && transitioning && !current && transitioning.state.isPreloaded) {
      state.current = transitioning;
      state.isTransitioning = false;
      transitioning = null;

      state.lastUpdateCurrentTick = tickTimerState.currentTick;
      state.lastUpdateTransitioningTick = tickTimerState.currentTick;

      return;
    }

    // 0,1,0
    if (!next && transitioning && !current && transitioning.state.isPreloading) {
      return;
    }

    // 0,1,0
    if (!next && transitioning && !current && !transitioning.state.isPreloading) {
      throw new Error("Transitioning scene is not preloading, but it was expected to be.");
    }

    // 0,1,1
    if (!next && transitioning && current) {
      throw new Error("Unexpected director state: both transitioning and final scenes are set.");
    }

    // 1,0,0
    if (next && !transitioning && !current) {
      preload(logger, next);

      state.next = null;
      state.isTransitioning = true;
      transitioning = next;

      state.lastUpdateNextTick = tickTimerState.currentTick;
      state.lastUpdateTransitioningTick = tickTimerState.currentTick;

      return;
    }

    // 1,0,1
    if (next && !transitioning && current) {
      dispose(logger, current);

      state.current = null;
      state.isTransitioning = true;

      state.lastUpdateCurrentTick = tickTimerState.currentTick;
      state.lastUpdateTransitioningTick = tickTimerState.currentTick;

      return;
    }

    // 1,1,0
    if (next && transitioning && !current) {
      throw new Error("Can't set a new scene while current one is still transitioning.");
    }

    // 1,1,1
    if (next && transitioning && current) {
      throw new Error("Can't set a new scene while current one is still transitioning.");
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: `Director(${debugName})`,
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
