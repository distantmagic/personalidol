import { Memorizable } from "src/framework/interfaces/Memorizable";
import { Memorizes } from "src/framework/interfaces/Sentient/Perceives/Memorizes";
import { Query } from "src/framework/interfaces/Query";

export default class Knows implements Query<boolean> {
  readonly memorizable: Memorizable;
  readonly memorizes: Memorizes;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
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
