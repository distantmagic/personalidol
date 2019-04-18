// @flow

import split from "lodash/split";

import TiledMapGrid from "./TiledMapGrid";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";
import type { TiledMapLayerGridCSVParser as TiledMapLayerGridCSVParserInterface } from "../interfaces/TiledMapLayerGridCSVParser";

// Maps have a simplified CSV format and we can make a few assumptions
// here:
//   1. all CSV elements are numbers
//   2. CSV is comma-separated
//   3. there might be trailing coma at the end of a line
//   4. CSV holds map sized array

export default class TiledMapLayerGridCSVParser
  implements TiledMapLayerGridCSVParserInterface {
  +data: string;
  +mapSize: ElementSize;

  constructor(data: string, mapSize: ElementSize) {
    this.data = data;
    this.mapSize = mapSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapGridInterface> {
    const layerData = this.data.trim();
    const layerLineWidth = this.mapSize.getWidth();
    const lines = split(layerData, "\n", this.mapSize.getHeight());
    const grid = lines.map(function(line: string): Array<number> {
      return split(line, ",", layerLineWidth).map(function(id: string): number {
        return parseInt(id, 10);
      });
    });

    return new TiledMapGrid(grid);
  }
}
