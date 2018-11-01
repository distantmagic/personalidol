// @flow

import ClockObserver from './ClockObserver';

export default class ClockNotifier {
  frequency: number;
  observers: Array<ClockObserver>;

  constructor(frequency: number) {
    this.frequency = frequency;
    this.observers = [];
  }

  notify(): void {
    for (let observer of this.observers) {
      observer.round();
    }
  }

  observe(observer: ClockObserver) {
    this.observers.push(observer);
  }

  tick(ticks: number): void {
    this.notify();
  }
}
