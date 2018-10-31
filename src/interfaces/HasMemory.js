// @flow

import type { Memorizable } from './Memorizable';

export interface HasMemory {
  forget(memorizable: Memorizable): void;

  knows(memorizable: Memorizable): boolean;

  learn(memorizable: Memorizable): void;
}
