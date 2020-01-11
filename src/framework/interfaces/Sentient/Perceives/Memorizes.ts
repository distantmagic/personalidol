import { Memorizable } from "../../Memorizable";
import { Perceives } from "../Perceives";

export interface Memorizes extends Perceives {
  forget(memorizable: Memorizable): Promise<void>;

  knows(memorizable: Memorizable): Promise<boolean>;

  learn(memorizable: Memorizable): Promise<void>;
}
