// @flow

import Command from '../Command';

import type { Message } from '../../domaininterfaces/Message';
import type { Memorizes } from '../../domaininterfaces/Sentient/Perceives/Memorizes';

export default class LearnMemorizable extends Command {
  message: Message;
  memorizes: Memorizes;

  constructor(memorizes: Memorizes, message: Message) {
    super();

    this.message = message;
    this.memorizes = memorizes;
  }
}
