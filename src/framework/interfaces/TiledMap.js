// @flow

import type { CancelToken } from "./CancelToken";
import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledCustomProperty } from "./TiledCustomProperty";
import type { TiledMapEllipseObject } from "./TiledMapEllipseObject";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledMapPolygonObject } from "./TiledMapPolygonObject";
import type { TiledMapRectangleObject } from "./TiledMapRectangleObject";
import type { TiledMapSkinnedLayer } from "./TiledMapSkinnedLayer";
import type { TiledTilesetOffsetCollection } from "./TiledTilesetOffsetCollection";

export interface TiledMap extends Equatable<TiledMap> {
  addLayer(TiledMapLayer): void;

  addEllipseObject(TiledMapEllipseObject): void;

  addPolygonObject(TiledMapPolygonObject): void;

  addRectangleObject(TiledMapRectangleObject): void;

  generateSkinnedLayers(CancelToken): AsyncGenerator<TiledMapSkinnedLayer, void, void>;

  getLayers(): $ReadOnlyArray<TiledMapLayer>;

  getLayerWithProperty(TiledCustomProperty): TiledMapLayer;

  getMapSize(): ElementSize<"tile">;

  getEllipseObjects(): $ReadOnlyArray<TiledMapEllipseObject>;

  getPolygonObjects(): $ReadOnlyArray<TiledMapPolygonObject>;

  getRectangleObjects(): $ReadOnlyArray<TiledMapRectangleObject>;

  getTileSize(): ElementSize<"px">;

  getTiledTilesetOffsetCollection(): TiledTilesetOffsetCollection;

  hasLayerWithProperty(TiledCustomProperty): boolean;
}
