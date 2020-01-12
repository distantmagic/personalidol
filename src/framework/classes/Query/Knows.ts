import Query from "src/framework/classes/Query";

import { Memorizable } from "src/framework/interfaces/Memorizable";
import { Memorizes } from "src/framework/interfaces/Sentient/Perceives/Memorizes";

export default class Knows extends Query<boolean> {
  readonly memorizable: Memorizable;
  readonly memorizes: Memorizes;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizable = memorizable;
    this.memorizes = memorizes;
  }

  async execute(): Promise<boolean> {
    return false;
  }

  isEqual(other: Knows): boolean {
    return false;
  }
}
