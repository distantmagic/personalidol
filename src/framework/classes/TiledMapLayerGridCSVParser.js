// @flow

import split from "lodash/split";

import Cancelled from "./Exception/Cancelled";
import TiledMapGrid from "./TiledMapGrid";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";
import type { TiledMapLayerGridCSVParser as TiledMapLayerGridCSVParserInterface } from "../interfaces/TiledMapLayerGridCSVParser";

export default class TiledMapLayerGridCSVParser
  implements TiledMapLayerGridCSVParserInterface {
  +data: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapSize: ElementSize<"tile">;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    data: string,
    mapSize: ElementSize<"tile">
  ) {
    this.data = data;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapSize = mapSize;
  }

  /**
   * Maps have a simplified CSV format and we can make a few assumptions
   * here:
   *   1. all CSV elements are numbers
   *   2. CSV is comma-separated
   *   3. there might be trailing coma at the end of a line
   *   4. CSV holds map sized array
   *   5. I have on idea why, but tile id's in map file are incremented by 1
   *      over those from tileset file
   */
  async parse(cancelToken: CancelToken): Promise<TiledMapGridInterface> {
    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        this.loggerBreadcrumbs.add("parse"),
        "Cancel token was cancelled before parsing layer grid."
      );
    }

    const layerData = this.data.trim();
    const layerLineWidth = this.mapSize.getWidth();
    const lines = split(layerData, "\n", this.mapSize.getHeight());
    const grid = lines.map(function(line: string): Array<number> {
      return split(line, ",", layerLineWidth).map(function(id: string): number {
        return parseInt(id, 10) - 1;
      });
    });

    return new TiledMapGrid(grid, this.mapSize);
  }
}
