// @flow

import type { Equatable } from "../interfaces/Equatable";

export type CollectionItem<T> = T & Equatable<T>;
