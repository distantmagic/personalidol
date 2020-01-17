import Command from "src/framework/classes/Command";

import Memorizes from "src/framework/interfaces/Sentient/Perceives/Memorizes";
import Message from "src/framework/interfaces/Perceivable/Message";

export default class LearnMemorizable extends Command {
  private message: Message;
  private memorizes: Memorizes;

  constructor(memorizes: Memorizes, message: Message) {
    super();

    this.message = message;
    this.memorizes = memorizes;
  }
}
