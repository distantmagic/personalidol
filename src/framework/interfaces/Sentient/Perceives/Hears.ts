import type Perceives from "src/framework/interfaces/Sentient/Perceives";
import type Vocal from "src/framework/interfaces/Perceivable/Message/Vocal";

export default interface Hears extends Perceives {
  hear(message: Vocal): Promise<void>;
}
