// @flow

import type { Equatable } from "./Equatable";
import type { Stringable } from "./Stringable";

export interface TiledRelativeFilename
  extends Equatable<TiledRelativeFilename>,
    Stringable {
  constructor(base: string, relative: string): void;

  isEqual(TiledRelativeFilename): boolean;
}
