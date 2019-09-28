// @flow

import Cancelled from "./Exception/Cancelled";
import ElementPosition from "./ElementPosition";
import Exception from "./Exception";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { TiledMapPolygonPointsParser as TiledMapPolygonPointsParserInterface } from "../interfaces/TiledMapPolygonPointsParser";

export default class TiledMapPolygonPointsParser implements TiledMapPolygonPointsParserInterface {
  +polygonPoints: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileSize: ElementSize<"px">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, polygonPoints: string, tileSize: ElementSize<"px">) {
    this.polygonPoints = polygonPoints;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileSize = tileSize;
  }

  async parse(cancelToken: CancelToken): Promise<$ReadOnlyArray<ElementPositionInterface<"tile">>> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(breadcrumbs, "Cancel token has been cancelled before parsing polygon points.");
    }

    const points = this.polygonPoints.trim().split(" ");
    const tileHeightPx = this.tileSize.getHeight();
    const tileWidthPx = this.tileSize.getWidth();

    return points.map(function(point: string): ElementPositionInterface<"tile"> {
      const [xString, yString] = point.split(",");
      const x = parseInt(xString, 10);
      const y = parseInt(yString, 10);

      if (isNaN(x) || isNaN(y)) {
        throw new Exception(breadcrumbs, `Invalid polygon point (NaN): "${point}"`);
      }

      return new ElementPosition(x / tileWidthPx, y / tileHeightPx);
    });
  }
}
