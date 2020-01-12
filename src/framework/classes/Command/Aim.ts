import Command from "../Command";

import { Aimable } from "../../interfaces/Memorizable/Aimable";
import { Aims } from "../../interfaces/Sentient/Aims";

export default class Aim extends Command {
  private aims: Aims;
  private aimable: Aimable;

  constructor(aims: Aims, aimable: Aimable) {
    super();

    this.aims = aims;
    this.aimable = aimable;
  }
}
