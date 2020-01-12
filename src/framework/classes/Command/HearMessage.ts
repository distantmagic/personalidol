import Command from "../Command";

import { Message } from "../../interfaces/Perceivable/Message";
import { Perceives } from "../../interfaces/Sentient/Perceives";

export default class HearMessage extends Command {
  private message: Message;
  private perceiving: Perceives;

  constructor(perceiving: Perceives, message: Message) {
    super();

    this.message = message;
    this.perceiving = perceiving;
  }
}
