// @flow

import Entity from '../Entity';

import type { Memorizable } from '../../interfaces/Memorizable';
import type { Memorizes } from '../../interfaces/Memorizes';
import type { Sentient } from '../../interfaces/Sentient';
import type { Speaks } from '../../interfaces/Speaks';

export default class Character extends Entity implements Memorizes, Speaks {
  forget(memorizable: Memorizable): void {
  }

  knows(memorizable: Memorizable): boolean {
  }

  learn(memorizable: Memorizable): void {
  }

  tell(beings: Array<Sentient>, message: string): void {
  }
}
