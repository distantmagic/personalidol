import type Aimable from "src/framework/interfaces/Memorizable/Aimable";
import type Sentient from "src/framework/interfaces/Sentient";

export default interface Aims extends Sentient {
  aim(aimable: Aimable): Promise<void>;
}
