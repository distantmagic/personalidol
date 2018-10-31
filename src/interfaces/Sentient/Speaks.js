// @flow

import type { Sentient } from '../Sentient';

export interface Speaks extends Sentient {
  tell(beings: Array<Sentient>, message: string): void;
}
