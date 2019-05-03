// @flow

import type { TiledMapBlockObjectSerializedObject } from "./TiledMapBlockObjectSerializedObject";

export type TiledMapRectangleObjectSerializedObject = {|
  isEllipse: false,
  isPolygon: false,
  isRectangle: true,
  tiledMapBlockObject: TiledMapBlockObjectSerializedObject
|};
