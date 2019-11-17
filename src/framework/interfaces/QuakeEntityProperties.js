// @flow

import type { Equatable } from "./Equatable";
import type { QuakeEntityProperty } from "./QuakeEntityProperty";

export interface QuakeEntityProperties extends Equatable<QuakeEntityProperties> {
  getProperties(): $ReadOnlyArray<QuakeEntityProperty>;
}
