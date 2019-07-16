// @flow

import type { CancelToken } from "./CancelToken";
import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledCustomProperty } from "./TiledCustomProperty";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledMapSkinnedLayer } from "./TiledMapSkinnedLayer";
import type { TiledTileset } from "./TiledTileset";
import type { TiledTilesetOffsetCollection } from "./TiledTilesetOffsetCollection";

export interface TiledMap extends Equatable<TiledMap> {
  addLayer(TiledMapLayer): void;

  generateSkinnedLayers(CancelToken): AsyncGenerator<TiledMapSkinnedLayer, void, void>;

  getLayers(): $ReadOnlyArray<TiledMapLayer>;

  getLayerWithProperty(TiledCustomProperty): TiledMapLayer;

  getMapSize(): ElementSize<"tile">;

  getTileSize(): ElementSize<"px">;

  getTiledTilesetOffsetCollection(): TiledTilesetOffsetCollection;

  getTiledTilesets(): $ReadOnlyArray<TiledTileset>;

  hasLayerWithProperty(TiledCustomProperty): boolean;
}
