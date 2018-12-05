// @flow

import Query from "../../../framework/classes/Query";

import type { Memorizable } from "../../interfaces/Memorizable";
import type { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";

export default class Knows extends Query<boolean> {
  memorizable: Memorizable;
  memorizes: Memorizes;

  constructor(memorizes: Memorizes, memorizable: Memorizable) {
    super();

    this.memorizable = memorizable;
    this.memorizes = memorizes;
  }
}
