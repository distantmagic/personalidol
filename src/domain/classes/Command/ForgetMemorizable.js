// @flow

import Command from "../../../framework/classes/Command";

import type { Memorizable } from "../../interfaces/Memorizable";
import type { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class ForgetMemorizable extends Command {
  memorizes: Memorizes;
  memorizable: Memorizable;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizes = memorizes;
    this.memorizable = memorizable;
  }
}
