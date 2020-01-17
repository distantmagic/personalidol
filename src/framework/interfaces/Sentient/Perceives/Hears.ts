import Perceives from "src/framework/interfaces/Sentient/Perceives";
import Vocal from "src/framework/interfaces/Perceivable/Message/Vocal";

export default interface Hears extends Perceives {
  hear(message: Vocal): Promise<void>;
}
