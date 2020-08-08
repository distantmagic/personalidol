import { Clock } from "three/src/core/Clock";

import type { MainLoop as IMainLoop } from "./MainLoop.interface";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Scheduler } from "./Scheduler.interface";

export function MainLoop<TickType>(frameScheduler: Scheduler<TickType>): IMainLoop {
  const updatables = new Set<MainLoopUpdatable>();

  const _clock = new Clock(false);
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

    updatables.forEach(_updateUpdatable);

    // something might have changed withing the update callback
    if (_continue) {
      _frameId = frameScheduler.requestFrame(tick);
    }
  }

  function _updateUpdatable(updatable: MainLoopUpdatable): void {
    updatable.update(_delta, _elapsedTime);
  }

  return Object.freeze({
    updatables: updatables,

    start: start,
    stop: stop,
    tick: tick,
  });
}
