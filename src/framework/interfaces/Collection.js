// @flow

import type { List } from "immutable";

import type { CollectionInput } from "../types/CollectionInput";
import type { CollectionItem } from "../types/CollectionItem";

export interface Collection<T> {
  constructor(CollectionInput<T>): void;

  add(CollectionItem<T>): Collection<T>;

  filter((CollectionItem<T>) => boolean): Collection<T>;

  forEach((CollectionItem<T>) => void): void;

  includes(CollectionItem<T>): boolean;

  map<U>((CollectionItem<T>) => U): Array<U>;

  toArray(): Array<CollectionItem<T>>;

  unique(): Collection<T>;
}
