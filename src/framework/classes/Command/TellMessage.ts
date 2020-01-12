import Command from "src/framework/classes/Command";

import { Message } from "src/framework/interfaces/Perceivable/Message";
import { Perceives } from "src/framework/interfaces/Sentient/Perceives";

export default class TellMessage extends Command {
  private message: Message;
  private perceiving: Perceives;

  constructor(perceiving: Perceives, message: Message) {
    super();

    this.message = message;
    this.perceiving = perceiving;
  }
}
