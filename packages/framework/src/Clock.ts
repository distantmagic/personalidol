import type { Clock as IClock } from "./Clock.interface";

function now(): number {
  return Date.now();
}

export function Clock(): IClock {
  let _diff: number = 0;
  let _elapsedTime: number = 0;
  let _newTime: number = 0;
  let _oldTime: number = 0;
  let _running: boolean = false;
  let _startTime: number = 0;

  function getDelta(): number {
    if (!_running) {
      throw new Error("Clock is not running");
    }

    _newTime = now();
    _diff = (_newTime - _oldTime) / 1000;
    _oldTime = _newTime;
    _elapsedTime += _diff;

    return _diff;
  }

  function getElapsedTime(): number {
    getDelta();

    return _elapsedTime;
  }

  function start() {
    if (_running) {
      throw new Error("Clock is already started");
    }

    _startTime = now();
    _oldTime = _startTime;
    _elapsedTime = 0;
    _running = true;
  }

  function stop() {
    if (!_running) {
      throw new Error("Clock is already stopped");
    }

    getDelta();

    _running = false;
  }

  return Object.freeze({
    autoStart: false,

    get elapsedTime() {
      return _elapsedTime;
    },

    get oldTime() {
      return _oldTime;
    },

    get running() {
      return _running;
    },

    get startTime() {
      return _startTime;
    },

    getDelta: getDelta,
    getElapsedTime: getElapsedTime,
    start: start,
    stop: stop,
  });
}
