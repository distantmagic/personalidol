// @flow

import type { Aimable } from "../Memorizable/Aimable";
import type { Sentient } from "../Sentient";

export interface Aims extends Sentient {
  aim(aimable: Aimable): void;
}
