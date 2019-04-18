// @flow

import { TiledMapLayer } from "./TiledMapLayer";

export interface TiledMap {
  addLayer(TiledMapLayer): void;
}
