// @flow

import Query from '../../classes/Query';

import type { Memorizable } from '../../domaininterfaces/Memorizable';
import type { Memorizes } from '../../domaininterfaces/Sentient/Perceives/Memorizes';

export default class Knows extends Query<boolean> {
  memorizable: Memorizable;
  memorizes: Memorizes;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizable = memorizable;
    this.memorizes = memorizes;
  }
}
