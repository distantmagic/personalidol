// @flow

import Command from '../Command';

import type { Message } from '../../domaininterfaces/Message';
import type { Perceives } from '../../domaininterfaces/Sentient/Perceives';

export default class HearMessage extends Command {
  message: Message;
  perceiving: Perceives;

  constructor(perceiving: Perceives, message: Message) {
    super();

    this.message = message;
    this.perceiving = perceiving;
  }
}
