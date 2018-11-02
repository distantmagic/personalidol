// @flow

import Command from '../../classes/Command';

import type { Message } from '../../domaininterfaces/Perceivable/Message';
import type { Perceives } from '../../domaininterfaces/Sentient/Perceives';

export default class TellMessage extends Command {
  message: Message;
  perceiving: Perceives;

  constructor(perceiving: Perceives, message: Message) {
    super();

    this.message = message;
    this.perceiving = perceiving;
  }
}
