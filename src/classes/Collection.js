// @flow

import type { Equatable } from '../interfaces/Equatable';

export default class Collection<T> {
  contains(element: Equatable): boolean {
    return false;
  }
}
