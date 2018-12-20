// @flow

import Command from "../Command";

import type { Aimable } from "../../interfaces/Memorizable/Aimable";
import type { Aims } from "../../interfaces/Sentient/Aims";

export default class Aim extends Command {
  aims: Aims;
  aimable: Aimable;

  constructor(aims: Aims, aimable: Aimable) {
    super();

    this.aims = aims;
    this.aimable = aimable;
  }
}
