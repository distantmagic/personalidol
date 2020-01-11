import { Message } from "../Perceivable/Message";
import { Perceives } from "./Perceives";
import { Sentient } from "../Sentient";

export interface Speaks extends Sentient {
  tell(beings: Set<Perceives>, message: Message): Promise<void>;
}
