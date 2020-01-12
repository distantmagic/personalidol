import { Message } from "src/framework/interfaces/Perceivable/Message";
import { Perceives } from "src/framework/interfaces/Sentient/Perceives";
import { Sentient } from "src/framework/interfaces/Sentient";

export interface Speaks extends Sentient {
  tell(beings: Set<Perceives>, message: Message): Promise<void>;
}
