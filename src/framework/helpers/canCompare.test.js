// @flow

import canCompare from "./canCompare";

import type { Equatable } from "../interfaces/Equatable";

class Foo implements Equatable<Foo> {
  +ref: number;

  constructor(ref: number) {
    this.ref = ref;
  }

  isEqual(other: Foo): boolean {
    return this.ref === other.ref;
  }
}

class Bar implements Equatable<Bar> {
  +ref: number;

  constructor(ref: number) {
    this.ref = ref;
  }

  isEqual(other: Bar): boolean {
    return this.ref === other.ref;
  }
}

class Baz extends Foo {}

test.each([
  [new Foo(1), new Foo(1), true, true],
  [new Foo(1), new Bar(1), false, null],
  [new Foo(1), new Baz(1), true, true],
  [new Baz(1), new Foo(1), false, null],
])(
  "detects if object can be compared",
  function(a: Equatable<any>, b: Equatable<any>, result: boolean, isEqual?: boolean) {
    expect(canCompare(a, b)).toBe(result);

    if ("boolean" === typeof isEqual) {
      expect(a.isEqual(b)).toBe(isEqual);
    }
  },
  100
);
