// @flow

import { List } from "immutable";

import type {
  Collection as CollectionInterface,
  CollectionInput
} from "../interfaces/Collection";
import type { Equatable } from "../interfaces/Equatable";

export default class Collection<T> implements CollectionInterface<T> {
  elements: List<Equatable<T>>;

  constructor(elements: CollectionInput<T>) {
    this.elements = List<Equatable<T>>(elements || []);
  }

  add(element: Equatable<T>): Collection<T> {
    return new Collection<T>(this.elements.push(element));
  }

  forEach(callback: (Equatable<T>) => void): void {
    this.elements.forEach(callback);
  }

  includes(some: T & Equatable<T>): boolean {
    return this.elements.some(element => element.isEqual(some));
  }
}
