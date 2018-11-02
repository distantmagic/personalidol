// @flow

import Command from '../Command';

import type { Aimable } from '../../domaininterfaces/Memorizable/Aimable';
import type { Aims } from '../../domaininterfaces/Sentient/Aims';

export default class Aim extends Command {
  aims: Aims;
  aimable: Aimable;

  constructor(aims: Aims, aimable: Aimable) {
    super();

    this.aims = aims;
    this.aimable = aimable;
  }
}
