import type { Nameable } from "./Nameable.interface";
import type { PauseableState } from "./PauseableState.type";

export interface Pauseable extends Nameable {
  state: PauseableState;

  pause(): void;

  unpause(): void;
}
