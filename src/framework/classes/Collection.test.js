// @flow

import Collection from "./Collection";

import type { Equatable } from "../interfaces/Equatable";

class Foo implements Equatable<Foo> {
  phrase: string;

  constructor(phrase: string) {
    this.phrase = phrase;
  }

  isEqual(other: Foo): boolean {
    return this.phrase === other.phrase;
  }
}

it("makes collection immutable", function() {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");

  const newColleciton = collection.add(foo);

  expect(collection).not.toBe(newColleciton);
  expect(collection.includesSimilar(foo)).toBe(false);
  expect(newColleciton.includesSimilar(foo)).toBe(true);
});

it("uses equatable to find objects", function() {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test");

  expect(collection.add(foo).includesSimilar(other)).toBe(true);
});

it("does not find object", function() {
  const collection = new Collection<Foo>();
  const foo = new Foo("test");
  const other = new Foo("test2");

  expect(collection.add(foo).includesSimilar(other)).toBe(false);
});

it("returns unique list", function() {
  const foo1 = new Foo("foo1");
  const foo2 = new Foo("foo1");
  const foo3 = new Foo("foo2");
  const collection = new Collection<Foo>([foo1, foo2, foo3]);

  const unique = collection.unique();

  expect(unique.includes(foo1)).toBe(true);
  expect(unique.includes(foo2)).toBe(false);
  expect(unique.includes(foo3)).toBe(true);
});
