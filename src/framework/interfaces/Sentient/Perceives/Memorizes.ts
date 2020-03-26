import type Memorizable from "src/framework/interfaces/Memorizable";
import type Perceives from "src/framework/interfaces/Sentient/Perceives";

export default interface Memorizes extends Perceives {
  forget(memorizable: Memorizable): Promise<void>;

  knows(memorizable: Memorizable): Promise<boolean>;

  learn(memorizable: Memorizable): Promise<void>;
}
