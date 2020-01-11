// @flow strict

import type { Message } from "../Perceivable/Message";
import type { Perceives } from "./Perceives";
import type { Sentient } from "../Sentient";

export interface Speaks extends Sentient {
  tell(beings: Set<Perceives>, message: Message): Promise<void>;
}
