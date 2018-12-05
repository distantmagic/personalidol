// @flow

import Command from "../../../framework/classes/Command";

import type { Message } from "../../interfaces/Perceivable/Message";
import type { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class LearnMemorizable extends Command {
  message: Message;
  memorizes: Memorizes;

  constructor(memorizes: Memorizes, message: Message) {
    super();

    this.message = message;
    this.memorizes = memorizes;
  }
}
