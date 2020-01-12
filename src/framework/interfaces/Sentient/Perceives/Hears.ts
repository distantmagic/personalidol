import { Vocal } from "src/framework/interfaces/Perceivable/Message/Vocal";
import { Perceives } from "src/framework/interfaces/Sentient/Perceives";

export interface Hears extends Perceives {
  hear(message: Vocal): Promise<void>;
}
