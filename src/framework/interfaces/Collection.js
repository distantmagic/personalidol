// @flow

import type { List } from "immutable";

import type { CollectionInput } from "../types/CollectionInput";
import type { CollectionItem } from "../types/CollectionItem";

export interface Collection<T> {
  constructor(elements: CollectionInput<T>): void;

  add(element: CollectionItem<T>): Collection<T>;

  forEach(callback: (CollectionItem<T>) => void): void;

  includes(some: CollectionItem<T>): boolean;

  map<U>(callback: (CollectionItem<T>) => U): Array<U>;

  toArray(): Array<CollectionItem<T>>;
}
