import { Vocal } from "../../Perceivable/Message/Vocal";
import { Perceives } from "../Perceives";

export interface Hears extends Perceives {
  hear(message: Vocal): Promise<void>;
}
