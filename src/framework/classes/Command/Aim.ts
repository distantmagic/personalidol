import Command from "src/framework/classes/Command";

import Aimable from "src/framework/interfaces/Memorizable/Aimable";
import Aims from "src/framework/interfaces/Sentient/Aims";

export default class Aim extends Command {
  private aims: Aims;
  private aimable: Aimable;

  constructor(aims: Aims, aimable: Aimable) {
    super();

    this.aims = aims;
    this.aimable = aimable;
  }
}
