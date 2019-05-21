// @flow

import type { ElementSizeSerializedObject } from "./ElementSizeSerializedObject";

export type TiledTileImageSerializedObject = {|
  elementSize: ElementSizeSerializedObject<"px">,
  source: string,
|};
