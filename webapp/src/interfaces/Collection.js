// @flow

import type { Equatable } from './Equatable';

export interface Collection<T> {
  constructor(elements: ?Array<Equatable<T>>): void;

  add(element: Equatable<T>): Collection<T>;

  contains(some: T & Equatable<T>): boolean;

  forEach(callback: (Equatable<T>) => void): void;
}
