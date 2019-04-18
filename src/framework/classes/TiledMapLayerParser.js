// @flow

import * as xml from "../helpers/xml";
import Cancelled from "./Exception/Cancelled";
import ElementSize from "./ElementSize";
import TiledMapLayer from "./TiledMapLayer";
import TiledMapLayerGridCSVParser from "./TiledMapLayerGridCSVParser";
import { default as TiledMapLayerException } from "./Exception/Tiled/Map/Layer";

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
    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        "Cancel token was cancelled before parsing tiled layer."
      );
    }

    const dataElement = this.layerElement.querySelector("data");

    if (!dataElement) {
      throw new TiledMapLayerException("No data found in map layer.");
    }

    const dataEncoding = xml.getStringAttribute(dataElement, "encoding");

    if ("csv" !== dataEncoding) {
      throw new TiledMapLayerException(
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
