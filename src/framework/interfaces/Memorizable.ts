// @flow strict

import type { Equatable } from "./Equatable";

export interface Memorizable extends Equatable<Memorizable> {}
