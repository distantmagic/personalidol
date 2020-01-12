import Command from "src/framework/classes/Command";

import { Memorizable } from "src/framework/interfaces/Memorizable";
import { Memorizes } from "src/framework/interfaces/Sentient/Perceives/Memorizes";

export default class ForgetMemorizable extends Command {
  private memorizes: Memorizes;
  private memorizable: Memorizable;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizes = memorizes;
    this.memorizable = memorizable;
  }
}
