// @flow

import type { Enumeration } from "../types/Enumeration";

export interface Enumerable {
  asEnumeration(): Enumeration;
}
