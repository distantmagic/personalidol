// @flow

import type { Equatable } from '../interfaces/Equatable';

export default class Collection<T> {
  elements: Array<Equatable<T>>;

  constructor(elements: ?Array<Equatable<T>>) {
    this.elements = elements || [];
  }

  add(element: Equatable<T>): Collection<T> {
    return new Collection<T>(this.elements.concat(element));
  }

  contains(some: T & Equatable<T>): boolean {
    return this.elements.some(element => element.isEqual(some));
  }
}
