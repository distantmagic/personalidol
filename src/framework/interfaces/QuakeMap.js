// @flow

import type { QuakeEntity } from "./QuakeEntity";

export interface QuakeMap {
  getEntities(): $ReadOnlyArray<QuakeEntity>;
}
