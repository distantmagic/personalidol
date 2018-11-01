// @flow

import Collection from '../../classes/Collection';
import CommandBus from '../../classes/CommandBus';
import Entity from '../Entity';
import ForgetMemorizable from '../../classes/Command/ForgetMemorizable';
import HearMessage from '../../classes/Command/HearMessage';
import LearnMemorizable from '../../classes/Command/LearnMemorizable';
import TellMessage from '../../classes/Command/TellMessage';

import type { Hears } from '../../domaininterfaces/Sentient/Perceives/Hears';
import type { Memorizable } from '../../domaininterfaces/Memorizable';
import type { Memorizes } from '../../domaininterfaces/Sentient/Perceives/Memorizes';
import type { Message } from '../../domaininterfaces/Message';
import type { Perceives } from '../../domaininterfaces/Sentient/Perceives';
import type { Sees } from '../../domaininterfaces/Sentient/Perceives/Sees';
import type { Speaks } from '../../domaininterfaces/Sentient/Speaks';
import type { Vocal } from '../../domaininterfaces/Message/Vocal';

export default class Character extends Entity implements Hears, Memorizes, Sees, Speaks {
  commandBus: CommandBus;
  memorized: Collection<Memorizable>;

  forget(memorizable: Memorizable): void {
    this.commandBus.source(new ForgetMemorizable(this, memorizable));
  }

  hear(message: Vocal): void {
    this.commandBus.source(new HearMessage(this, message));
  }

  knows(memorizable: Memorizable): boolean {
    return this.memorized.contains(memorizable);
  }

  learn(memorizable: Memorizable): void {
    this.commandBus.source(new LearnMemorizable(this, memorizable));
  }

  tell(beings: Array<Perceives>, message: Message): void {
    for (let being of beings) {
      this.commandBus.source(new TellMessage(being, message));
    }
  }
}
