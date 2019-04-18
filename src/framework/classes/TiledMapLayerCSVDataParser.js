// @flow

import split from "lodash/split";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapLayerCSVDataParser as TiledMapLayerCSVDataParserInterface } from "../interfaces/TiledMapLayerCSVDataParser";

// Maps have a simplified CSV format and we can make a few assumptions
// here:
//   1. all CSV elements are numbers
//   2. CSV is comma-separated
//   3. there might be trailing coma at the end of a line
//   4. CSV holds map sized array

export default class TiledMapLayerCSVDataParser implements TiledMapLayerCSVDataParserInterface {
  +data: string;
  +mapSize: ElementSize;

  constructor(data: string, mapSize: ElementSize) {
    this.data = data;
    this.mapSize = mapSize;
  }

  async parse(cancelToken: CancelToken): Promise<Array<Array<string>>> {
    const layerData = this.data.trim();
    const lines = split(layerData, "\n", this.mapSize.getHeight());
    const layerLineWidth = this.mapSize.getWidth();

    return lines.map(function(line: string): Array<string> {
      return split(line, ",", layerLineWidth);
    });
  }
}
