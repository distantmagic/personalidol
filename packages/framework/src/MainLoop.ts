import { Clock } from "three/src/core/Clock";
import { MathUtils } from "three/src/math/MathUtils";

import { isNameable } from "./isNameable";
import { name } from "./name";

import type { Logger } from "loglevel";

import type { MainLoop as IMainLoop } from "./MainLoop.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Scheduler } from "./Scheduler.interface";
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
export function MainLoop<TickType>(logger: Logger, frameScheduler: Scheduler<TickType>): IMainLoop {
  const clock = new Clock(false);
  const tickTimerState: TickTimerState = Object.seal({
    currentTick: 0,
    delta: 0,
    elapsedTime: 0,
  });
  const updatables = new Set<MainLoopUpdatable>();

  let _continue: boolean = false;
  let _frameId: null | TickType = null;

  function start(): void {
    if (_continue) {
      throw new Error("Main loop is alread started.");
    }

    clock.start();

    _continue = true;
    _frameId = frameScheduler.requestFrame(tick);
  }

  function stop(): void {
    if (!_continue) {
      throw new Error("Main loop is alread stopped.");
    }

    clock.stop();

    if (null !== _frameId) {
      frameScheduler.cancelFrame(_frameId);
    }

    _continue = false;
    _frameId = null;
  }

  function tick(now: number): void {
    tickTimerState.currentTick += 1;
    tickTimerState.delta = clock.getDelta();
    tickTimerState.elapsedTime = clock.getElapsedTime();

    updatables.forEach(_updateUpdatable);

    // something might have changed withing the update callback
    if (_continue) {
      _frameId = frameScheduler.requestFrame(tick);
    }
  }

  function _updateUpdatable(updatable: MainLoopUpdatable): void {
    if (updatable.state.needsUpdates) {
      updatable.update(tickTimerState.delta, tickTimerState.elapsedTime, tickTimerState);
    } else {
      updatables.delete(updatable);

      if (!isNameable(updatable)) {
        return;
      }

      logger.info(`REMOVED(MAIN_LOOP(${name(updatable)}))`);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isMainLoop: true,
    name: "MainLoop",
    tickTimerState: tickTimerState,
    updatables: updatables,

    start: start,
    stop: stop,
    tick: tick,
  });
}
