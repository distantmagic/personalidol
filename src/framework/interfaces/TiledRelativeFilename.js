// @flow

import type { Stringable } from "./Stringable";

export interface TiledRelativeFilename extends Stringable {
  constructor(base: string, relative: string): void;
}
