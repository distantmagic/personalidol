// @flow

import type { CancelToken } from "./CancelToken";
import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapEllipseObject } from "./TiledMapEllipseObject";
import type { TiledMapPolygonObject } from "./TiledMapPolygonObject";
import type { TiledMapRectangleObject } from "./TiledMapRectangleObject";
import type { TiledMapLayer } from "./TiledMapLayer";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledMapSkinnedLayer } from "./TiledMapSkinnedLayer";
import type { TiledTileset } from "./TiledTileset";

export interface TiledMap
  extends Equatable<TiledMap>,
    JsonSerializable<TiledMapSerializedObject> {
  addLayer(TiledMapLayer): void;

  addEllipseObject(TiledMapEllipseObject): void;

  addPolygonObject(TiledMapPolygonObject): void;

  addRectangleObject(TiledMapRectangleObject): void;

  generateSkinnedLayers(
    CancelToken
  ): AsyncGenerator<TiledMapSkinnedLayer, void, void>;

  getLayers(): Array<TiledMapLayer>;

  getMapSize(): ElementSize<"tile">;

  getEllipseObjects(): Array<TiledMapEllipseObject>;

  getPolygonObjects(): Array<TiledMapPolygonObject>;

  getRectangleObjects(): Array<TiledMapRectangleObject>;

  getTileSize(): ElementSize<"px">;

  getTiledTileset(): TiledTileset;
}
