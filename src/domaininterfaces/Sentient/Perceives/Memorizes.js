// @flow

import type { Memorizable } from '../../Memorizable';
import type { Perceives } from '../Perceives';

export interface Memorizes extends Perceives {
  forget(memorizable: Memorizable): void;

  knows(memorizable: Memorizable): boolean;

  learn(memorizable: Memorizable): void;
}
