// @flow

import type { Message } from '../Message';
import type { Sentient } from '../Sentient';

export interface Speaks extends Sentient {
  tell(beings: Array<Sentient>, message: Message): void;
}
