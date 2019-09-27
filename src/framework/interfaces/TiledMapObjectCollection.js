// @flow

import type { Arrayable } from "./Arrayable";
import type { TiledMapObject } from "./TiledMapObject";

export interface TiledMapObjectCollection<T: TiledMapObject> extends Arrayable<T> {
  item(number): T;
}
