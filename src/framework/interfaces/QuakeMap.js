// @flow

import type { Equatable } from "./Equatable";
import type { QuakeEntity } from "./QuakeEntity";

export interface QuakeMap extends Equatable<QuakeMap> {
  getEntities(): $ReadOnlyArray<QuakeEntity>;
}
