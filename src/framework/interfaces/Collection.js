// @flow

import type { List } from "immutable";

import type { CollectionInput } from "../types/CollectionInput";
import type { CollectionItem } from "../types/CollectionItem";

export interface Collection<T> {
  constructor(CollectionInput<T>): void;

  add(CollectionItem<T>): Collection<T>;

  contract((Collection<T>, CollectionItem<T>) => any): Collection<T>;

  filter((CollectionItem<T>) => boolean): Collection<T>;

  find((CollectionItem<T>) => boolean): ?CollectionItem<T>;

  forEach((CollectionItem<T>) => void): void;

  includes(CollectionItem<T>): boolean;

  includesSimilar(CollectionItem<T>): boolean;

  map<U>((CollectionItem<T>) => U): Array<U>;

  similar(CollectionItem<T>): Collection<T>;

  some((CollectionItem<T>) => boolean): boolean;

  toArray(): Array<CollectionItem<T>>;

  unique(): Collection<T>;
}
