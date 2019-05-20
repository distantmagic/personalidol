// @flow

import type { TiledCustomPropertyType } from "./TiledCustomPropertyType";

export type TiledCustomPropertySerializedObject = {|
  name: string,
  type: TiledCustomPropertyType,
  value: string
|};
