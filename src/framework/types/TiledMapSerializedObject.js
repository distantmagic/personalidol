// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledMapEllipseObjectSerializedObject } from "./TiledMapEllipseObjectSerializedObject";
import type { TiledMapLayerSerializedObject } from "./TiledMapLayerSerializedObject";
import type { TiledMapPolygonObjectSerializedObject } from "./TiledMapPolygonObjectSerializedObject";
import type { TiledMapRectangleObjectSerializedObject } from "./TiledMapRectangleObjectSerializedObject";
import type { TiledTilesetSerializedObject } from "./TiledTilesetSerializedObject";

export type TiledMapSerializedObject = {|
  ellipseObjects: $ReadOnlyArray<TiledMapEllipseObjectSerializedObject>,
  layers: $ReadOnlyArray<TiledMapLayerSerializedObject>,
  mapSize: ElementSizeSerializedObject<"tile">,
  polygonObjects: $ReadOnlyArray<TiledMapPolygonObjectSerializedObject>,
  rectangleObjects: $ReadOnlyArray<TiledMapRectangleObjectSerializedObject>,
  tiledTileset: TiledTilesetSerializedObject,
  tileSize: ElementSizeSerializedObject<"px">,
|};
