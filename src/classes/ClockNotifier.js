// @flow

import ClockObserver from './ClockObserver';

export default class ClockNotifier {
  frequency: number;
  observers: Array<ClockObserver>;

  constructor(frequency: number) {
    this.frequency = frequency;
    this.observers = [];
  }

  addObserver(observer: ClockObserver) {
    this.observers.push(observer);
  }

  notify(): void {
    for (let observer of this.observers) {
      observer.round();
    }
  }

  tick(ticks: number): void {
    if (0 === ticks % this.frequency) {
      this.notify();
    }
  }
}
