// @flow

import type { List } from "immutable";

import type { CollectionItem } from "./CollectionItem";

export type CollectionInput<T> =
  | Array<CollectionItem<T>>
  | List<CollectionItem<T>>;
