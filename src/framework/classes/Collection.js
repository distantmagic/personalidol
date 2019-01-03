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

  forEach(callback: (CollectionItem<T>) => void): void {
    this.elements.forEach(callback);
  }

  map<U>(callback: (CollectionItem<T>) => U): Array<U> {
    return this.elements.map(callback).toArray();
  }

  includes(some: CollectionItem<T>): boolean {
    return this.elements.some(element => element.isEqual(some));
  }

  toArray(): Array<CollectionItem<T>> {
    return this.elements.toArray();
  }
}
