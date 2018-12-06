// @flow

import type { List } from "immutable";
import type { Equatable } from "./Equatable";

export type CollectionInput<U> = ?Array<Equatable<U>> | ?List<Equatable<U>>;

export interface Collection<T> {
  constructor(elements: CollectionInput<T>): void;

  add(element: Equatable<T>): Collection<T>;

  forEach(callback: (Equatable<T>) => void): void;

  includes(some: T & Equatable<T>): boolean;
}
