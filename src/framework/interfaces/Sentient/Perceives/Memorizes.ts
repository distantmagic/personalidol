import { Memorizable } from "src/framework/interfaces/Memorizable";
import { Perceives } from "src/framework/interfaces/Sentient/Perceives";

export interface Memorizes extends Perceives {
  forget(memorizable: Memorizable): Promise<void>;

  knows(memorizable: Memorizable): Promise<boolean>;

  learn(memorizable: Memorizable): Promise<void>;
}
