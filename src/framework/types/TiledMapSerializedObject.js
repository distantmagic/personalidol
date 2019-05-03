// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";
import type { TiledMapEllipseObjectSerializedObject } from "./TiledMapEllipseObjectSerializedObject";
import type { TiledMapLayerSerializedObject } from "./TiledMapLayerSerializedObject";
import type { TiledMapPolygonObjectSerializedObject } from "./TiledMapPolygonObjectSerializedObject";
import type { TiledMapRectangleObjectSerializedObject } from "./TiledMapRectangleObjectSerializedObject";

export type TiledMapSerializedObject = {|
  ellipseObjects: Array<TiledMapEllipseObjectSerializedObject>,
  layers: Array<TiledMapLayerSerializedObject>,
  mapSize: ElementSizeSerializedObject<"tile">,
  polygonObjects: Array<TiledMapPolygonObjectSerializedObject>,
  rectangleObjects: Array<TiledMapRectangleObjectSerializedObject>
|};
