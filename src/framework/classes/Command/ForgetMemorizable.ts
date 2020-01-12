import Command from "../Command";

import { Memorizable } from "../../interfaces/Memorizable";
import { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class ForgetMemorizable extends Command {
  private memorizes: Memorizes;
  private memorizable: Memorizable;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizes = memorizes;
    this.memorizable = memorizable;
  }
}
