// @flow

import type { AsyncParser } from "./AsyncParser";
import type { ElementPosition } from "./ElementPosition";

export interface TiledMapPolygonPointsParser extends AsyncParser<$ReadOnlyArray<ElementPosition<"tile">>> {}
