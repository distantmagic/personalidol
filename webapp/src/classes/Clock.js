// @flow

import ClockNotifier from './ClockNotifier';

export default class Clock {
  clockNotifier: ClockNotifier;
  ticks: number;

  constructor(clockNotifier: ClockNotifier) {
    this.clockNotifier = clockNotifier;
    this.reset();
  }

  reset(): void {
    this.ticks = 0;
  }

  tick(): void {
    this.ticks += 1;
    this.clockNotifier.tick(this.ticks);
  }
}
