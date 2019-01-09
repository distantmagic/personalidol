// @flow

import { List } from "immutable";

import type { Collection as CollectionInterface } from "../interfaces/Collection";
import type { CollectionInput } from "../types/CollectionInput";
import type { CollectionItem } from "../types/CollectionItem";

export default class Collection<T> implements CollectionInterface<T> {
  elements: List<CollectionItem<T>>;

  constructor(elements: CollectionInput<T>) {
    this.elements = List<CollectionItem<T>>(elements || []);
  }

  add(element: CollectionItem<T>): Collection<T> {
    return new Collection<T>(this.elements.push(element));
  }

  contract(
    reducer: (Collection<T>, CollectionItem<T>) => Collection<T>
  ): Collection<T> {
    return this.elements.reduce<Collection<T>>(reducer, new Collection());
  }

  filter(callback: (CollectionItem<T>) => boolean): Collection<T> {
    return new Collection(this.elements.filter(callback));
  }

  find(predicate: (CollectionItem<T>) => boolean): ?CollectionItem<T> {
    return this.elements.find(predicate);
  }

  forEach(callback: (CollectionItem<T>) => void): void {
    this.elements.forEach(callback);
  }

  map<U>(callback: (CollectionItem<T>) => U): Array<U> {
    return this.elements.map(callback).toArray();
  }

  includes(some: CollectionItem<T>): boolean {
    return this.elements.includes(some);
  }

  includesSimilar(some: CollectionItem<T>): boolean {
    return this.some(element => element.isEqual(some));
  }

  similar(some: CollectionItem<T>): Collection<T> {
    return this.filter(element => element.isEqual(some) && element !== some);
  }

  some(predicate: (CollectionItem<T>) => boolean): boolean {
    return this.elements.some(predicate);
  }

  toArray(): Array<CollectionItem<T>> {
    return this.elements.toArray();
  }

  unique(): Collection<T> {
    return this.contract((acc, item) =>
      acc.includesSimilar(item) ? acc : acc.add(item)
    );
  }
}
