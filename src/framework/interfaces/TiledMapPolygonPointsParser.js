// @flow

import type { AsyncParser } from "./AsyncParser";
import type { ElementPosition } from "./ElementPosition";
import type { ElementPositionCollection } from "./ElementPositionCollection";

export interface TiledMapPolygonPointsParser extends AsyncParser<ElementPositionCollection<"tile">> {}
