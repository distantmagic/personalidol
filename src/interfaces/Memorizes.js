// @flow

import type { Memorizable } from './Memorizable';
import type { Sentient } from './Sentient';

export interface Memorizes {
  forget(memorizable: Memorizable): void;

  knows(memorizable: Memorizable): boolean;

  learn(memorizable: Memorizable): void;
}
