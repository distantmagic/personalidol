// @flow

import Entity from '../Entity';

import type { Hears } from '../../interfaces/Sentient/Perceives/Hears';
import type { Memorizable } from '../../interfaces/Memorizable';
import type { Memorizes } from '../../interfaces/Sentient/Perceives/Memorizes';
import type { Message } from '../../interfaces/Message';
import type { Sees } from '../../interfaces/Sentient/Perceives/Sees';
import type { Sentient } from '../../interfaces/Sentient';
import type { Speaks } from '../../interfaces/Sentient/Speaks';
import type { Vocal } from '../../interfaces/Message/Vocal';

export default class Character extends Entity implements Hears, Memorizes, Sees, Speaks {
  forget(memorizable: Memorizable): void {
  }

  hear(message: Vocal): void {
  }

  knows(memorizable: Memorizable): boolean {
    return false;
  }

  learn(memorizable: Memorizable): void {
  }

  tell(beings: Array<Sentient>, message: Message): void {
  }
}
