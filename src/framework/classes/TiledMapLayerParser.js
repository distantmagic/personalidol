// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledMapLayer from "./TiledMapLayer";
import TiledMapLayerGridCSVParser from "./TiledMapLayerGridCSVParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";
import type { TiledMapLayerParser as TiledMapLayerParserInterface } from "../interfaces/TiledMapLayerParser";

export default class TiledMapLayerParser
  implements TiledMapLayerParserInterface {
  +layerElement: HTMLElement;
  +mapSize: ElementSizeInterface<"tile">;

  constructor(
    layerElement: HTMLElement,
    mapSize: ElementSizeInterface<"tile">
  ) {
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

    const tiledMapLayerCSVDataParser = new TiledMapLayerGridCSVParser(
      dataElement.textContent,
      this.mapSize
    );
    const tiledMapGrid = await tiledMapLayerCSVDataParser.parse(cancelToken);
    const layerId = xml.getNumberAttribute(this.layerElement, "id");
    const layerName = xml.getStringAttribute(this.layerElement, "name");
    const layerSize = new ElementSize<"tile">(
      xml.getNumberAttribute(this.layerElement, "width"),
      xml.getNumberAttribute(this.layerElement, "height")
    );

    return new TiledMapLayer(layerId, layerName, tiledMapGrid, layerSize);
  }
}
