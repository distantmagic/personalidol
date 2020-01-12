import Command from "../Command";

import { Message } from "../../interfaces/Perceivable/Message";
import { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class LearnMemorizable extends Command {
  private message: Message;
  private memorizes: Memorizes;

  constructor(memorizes: Memorizes, message: Message) {
    super();

    this.message = message;
    this.memorizes = memorizes;
  }
}
