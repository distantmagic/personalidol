// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledTileset } from "./TiledTileset";

export interface TiledMap {
  constructor(ElementSize<"tile">, TiledTileset): void;

  addLayer(TiledMapLayer): void;

  getMapSize(): ElementSize<"tile">;
}
