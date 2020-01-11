import { Aimable } from "../Memorizable/Aimable";
import { Sentient } from "../Sentient";

export interface Aims extends Sentient {
  aim(aimable: Aimable): Promise<void>;
}
