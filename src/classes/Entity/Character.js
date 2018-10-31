// @flow

import Entity from '../Entity';

import type { Memorizable } from '../../interfaces/Memorizable';
import type { HasMemory } from '../../interfaces/HasMemory';

export default class Character extends Entity implements HasMemory {
  forget(memorizable: Memorizable): void {
  }

  knows(memorizable: Memorizable): boolean {
    return false;
  }

  learn(memorizable: Memorizable): void {
  }
}
