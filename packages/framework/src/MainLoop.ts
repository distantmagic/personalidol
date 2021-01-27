// import { Clock } from "three/src/core/Clock";
import { MathUtils } from "three/src/math/MathUtils";

import { Clock } from "./Clock";

import type { MainLoop as IMainLoop } from "./MainLoop.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Scheduler } from "./Scheduler.interface";
import type { StatsHooks } from "./StatsHooks.interface";
import type { TickTimerState } from "./TickTimerState.type";

/**
 * Why tick timer state exists? There are some services that need to sync
 * depending on the time their data was last modified. Since
 * `performance.now()` is not that reliable since Spectre/Meltdown, I decided
 * to use something else and measure time in elapsed main loop ticks.
 * In the worst case it would cause 1 frame delay between syncing data, but
 * in most cases update/sync would be done in the same frame. To achieve that
 * though, services need to be added to the main loop in the adequate order.
 *
 * Is this safe on the basic level though?
 * It can increment until it reaches Number.MAX_SAFE_INTEGER. At the moment
 * of writing this MAX_SAFE_INTEGER is about 9007199254740991 on most
 * devices. It means that it will work for 9007199254740991 frames, then it
 * would crash or behave unpredictably. Achieving 9007199254740991 frames at
 * 100 FPS would take 90071992547409,91 seconds, which is 171369848 years.
 * After that time, you would have to reload the page to continue using the
 * app. I think that this is acceptable.
 *
 * @see HTMLElementResizeObserver
 * @see MouseObserevr
 * @see TouchObserver
 */
export function MainLoop<TickType>(statsHooks: StatsHooks, frameScheduler: Scheduler<TickType>): IMainLoop {
  const tickTimerState: TickTimerState = Object.seal({
    currentTick: 0,
    elapsedTime: 0,
  });
  const updatables = new Set<MainLoopUpdatable>();

  const _clock = Clock();
  let _continue: boolean = false;
  let _delta: number = 0;
  let _elapsedTime: number = 0;
  let _frameId: null | TickType = null;

  function start(): void {
    if (_continue) {
      throw new Error("Main loop is alread started.");
    }

    _clock.start();
    _continue = true;
    _frameId = frameScheduler.requestFrame(tick);
  }

  function stop(): void {
    if (!_continue) {
      throw new Error("Main loop is alread stopped.");
    }

    _clock.stop();
    _continue = false;

    if (null !== _frameId) {
      frameScheduler.cancelFrame(_frameId);
    }

    _frameId = null;
  }

  function tick(): void {
    _delta = _clock.getDelta();
    _elapsedTime = _clock.getElapsedTime();

    tickTimerState.currentTick += 1;
    tickTimerState.elapsedTime = _elapsedTime;

    statsHooks.tick(_delta);
    updatables.forEach(_updateUpdatable);

    // something might have changed withing the update callback
    if (_continue) {
      _frameId = frameScheduler.requestFrame(tick);
    }
  }

  function _updateUpdatable(updatable: MainLoopUpdatable): void {
    updatable.update(_delta, _elapsedTime, tickTimerState);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "MainLoop",
    tickTimerState: tickTimerState,
    updatables: updatables,

    start: start,
    stop: stop,
    tick: tick,
  });
}
