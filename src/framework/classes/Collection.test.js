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
  expect(collection.includes(foo)).toBe(false);
  expect(newColleciton.includes(foo)).toBe(true);
});

it("uses equatable to find objects", () => {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test");

  expect(collection.add(foo).includes(other)).toBe(true);
});

it("does not find object", () => {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test2");

  expect(collection.add(foo).includes(other)).toBe(false);
});

it("returns unique list", () => {
  const foo1 = new Foo("foo1");
  const foo2 = new Foo("foo1");
  const foo3 = new Foo("foo2");
  const collection = new Collection<Foo>([foo1, foo2, foo3]);

  const unique = collection.unique();

  expect(unique.elements.includes(foo1)).toBe(true);
  expect(unique.elements.includes(foo2)).toBe(false);
  expect(unique.elements.includes(foo3)).toBe(true);
});
