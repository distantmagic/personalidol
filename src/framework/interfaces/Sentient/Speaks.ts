import type Message from "src/framework/interfaces/Perceivable/Message";
import type Perceives from "src/framework/interfaces/Sentient/Perceives";
import type Sentient from "src/framework/interfaces/Sentient";

export default interface Speaks extends Sentient {
  tell(beings: Set<Perceives>, message: Message): Promise<void>;
}
