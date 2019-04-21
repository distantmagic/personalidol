// @flow

import ElementPosition from "./ElementPosition";
import Exception from "./Exception";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { TiledMapPolygonPointsParser as TiledMapPolygonPointsParserInterface } from "../interfaces/TiledMapPolygonPointsParser";

export default class TiledMapPolygonPointsParser
  implements TiledMapPolygonPointsParserInterface {
  +content: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tileSize: ElementSize<"px">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    content: string,
    tileSize: ElementSize<"px">
  ) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tileSize = tileSize;
  }

  async parse(
    cancelToken: CancelToken
  ): Promise<Array<ElementPositionInterface<"tile">>> {
    const breadcrumbs = this.loggerBreadcrumbs;
    const points = this.content.trim().split(" ");
    const tileHeightPx = this.tileSize.getHeight();
    const tileWidthPx = this.tileSize.getWidth();

    return points.map(function(
      point: string
    ): ElementPositionInterface<"tile"> {
      const [xString, yString] = point.split(",");
      const x = parseInt(xString, 10);
      const y = parseInt(yString, 10);

      if (isNaN(x) || isNaN(y)) {
        throw new Exception(
          breadcrumbs,
          `Invalid polygon point (NaN): "${point}"`
        );
      }

      return new ElementPosition(x / tileWidthPx, y / tileHeightPx);
    });
  }
}
