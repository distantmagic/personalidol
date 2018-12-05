// @flow

import Collection from "./Collection";

import type { Equatable } from "../interfaces/Equatable";

declare var expect: any;
declare var it: any;

class Foo implements Equatable<Foo> {
  phrase: string;

  constructor(phrase: string) {
    this.phrase = phrase;
  }

  isEqual(other: Foo): boolean {
    return this.phrase === other.phrase;
  }
}

it("makes collection immutable", () => {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");

  const newColleciton = collection.add(foo);

  expect(collection).not.toBe(newColleciton);
  expect(collection.contains(foo)).toBe(false);
  expect(newColleciton.contains(foo)).toBe(true);
});

it("uses equatable to find objects", () => {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test");

  expect(collection.add(foo).contains(other)).toBe(true);
});

it("does not find object", () => {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test2");

  expect(collection.add(foo).contains(other)).toBe(false);
});
