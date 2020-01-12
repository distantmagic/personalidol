import { Aimable } from "src/framework/interfaces/Memorizable/Aimable";
import { Sentient } from "src/framework/interfaces/Sentient";

export interface Aims extends Sentient {
  aim(aimable: Aimable): Promise<void>;
}
