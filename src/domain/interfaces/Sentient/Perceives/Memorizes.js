// @flow

import type { Memorizable } from "../../Memorizable";
import type { Perceives } from "../Perceives";

export interface Memorizes extends Perceives {
  forget(memorizable: Memorizable): void;

  knows(memorizable: Memorizable): Promise<boolean>;

  learn(memorizable: Memorizable): void;
}
