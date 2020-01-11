import Command from "../Command";

import { Memorizable } from "../../interfaces/Memorizable";
import { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class ForgetMemorizable extends Command {
  memorizes: Memorizes;
  memorizable: Memorizable;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizes = memorizes;
    this.memorizable = memorizable;
  }
}
