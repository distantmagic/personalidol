// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledMapLayerCSVDataParser from "./TiledMapLayerCSVDataParser";
import TiledMapLayer from "./TiledMapLayer";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";
import type { TiledMapLayerParser as TiledMapLayerParserInterface } from "../interfaces/TiledMapLayerParser";

export default class TiledMapLayerParser
  implements TiledMapLayerParserInterface {
  +layerElement: HTMLElement;
  +mapSize: ElementSizeInterface;

  constructor(layerElement: HTMLElement, mapSize: ElementSizeInterface) {
    this.layerElement = layerElement;
    this.mapSize = mapSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapLayerInterface> {
    const dataElement = this.layerElement.querySelector("data");

    if (!dataElement) {
      throw new Error("No data found in map layer.");
    }

    const dataEncoding = xml.getStringAttribute(dataElement, "encoding");

    if ("csv" !== dataEncoding) {
      throw new Error(
        `Data encoding format is not supported yet: "${dataEncoding}"`
      );
    }

    const tiledMapLayerCSVDataParser = new TiledMapLayerCSVDataParser(
      dataElement.textContent,
      this.mapSize
    );
    const layerData = await tiledMapLayerCSVDataParser.parse(cancelToken);

    console.log(layerData);

    return new TiledMapLayer();
  }
}
