// @flow

import TiledMapObject from "../TiledMapObject";

import type { ElementPosition } from "../../interfaces/ElementPosition";
import type { ElementPositionCollection } from "../../interfaces/ElementPositionCollection";
import type { ElementRotation } from "../../interfaces/ElementRotation";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { Polygon as TiledMapPolygonObject } from "../../interfaces/TiledMapObject/Polygon";
import type { TiledCustomProperties } from "../../interfaces/TiledCustomProperties";

export default class Polygon extends TiledMapObject implements TiledMapPolygonObject {
  +tiledMapPolygonPoints: ElementPositionCollection<"tile">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    name: string,
    elementPosition: ElementPosition<"tile">,
    elementRotation: ElementRotation<"radians">,
    elementSize: ElementSize<"tile">,
    tiledCustomProperties: TiledCustomProperties,
    tiledMapPolygonPoints: ElementPositionCollection<"tile">
  ) {
    super(loggerBreadcrumbs, name, elementPosition, elementRotation, elementSize, tiledCustomProperties);

    this.tiledMapPolygonPoints = tiledMapPolygonPoints;
  }
}
