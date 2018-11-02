// @flow

import Command from '../../classes/Command';

import type { Memorizable } from '../../domaininterfaces/Memorizable';
import type { Memorizes } from '../../domaininterfaces/Sentient/Perceives/Memorizes';

export default class ForgetMemorizable extends Command {
  memorizes: Memorizes;
  memorizable: Memorizable;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizes = memorizes;
    this.memorizable = memorizable;
  }
}
