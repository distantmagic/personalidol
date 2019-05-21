// @flow

import type { TiledMapBlockObjectSerializedObject } from "./TiledMapBlockObjectSerializedObject";

export type TiledMapEllipseObjectSerializedObject = {|
  isEllipse: true,
  isPolygon: false,
  isRectangle: false,
  tiledMapBlockObject: TiledMapBlockObjectSerializedObject,
|};
