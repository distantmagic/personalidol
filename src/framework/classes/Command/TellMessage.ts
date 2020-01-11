import Command from "../Command";

import { Message } from "../../interfaces/Perceivable/Message";
import { Perceives } from "../../interfaces/Sentient/Perceives";

export default class TellMessage extends Command {
  message: Message;
  perceiving: Perceives;

  constructor(perceiving: Perceives, message: Message) {
    super();

    this.message = message;
    this.perceiving = perceiving;
  }
}
