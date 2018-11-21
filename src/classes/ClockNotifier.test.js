// @flow

import ClockNotifier from "./ClockNotifier";
import ClockObserver from "./ClockObserver";

declare var expect: any;
declare var it: any;
declare var jest: any;

class Foo extends ClockObserver {
  callback: Function;

  constructor(callback: Function) {
    super();

    this.callback = callback;
  }

  flush(): void {
    this.callback();
  }
}

it("notifies with given frequency", () => {
  const clockNotifier = new ClockNotifier(2);
  const mockedCallback = jest.fn();
  const clockObserver = new Foo(mockedCallback);

  clockNotifier.addObserver(clockObserver);

  clockNotifier.tick(1);

  expect(mockedCallback).not.toHaveBeenCalled();

  clockNotifier.tick(2);

  expect(mockedCallback).toHaveBeenCalled();
});
