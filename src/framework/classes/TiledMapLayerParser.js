// @flow

import * as xml from "../helpers/xml";
import Cancelled from "./Exception/Cancelled";
import ElementSize from "./ElementSize";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomPropertiesParser from "./TiledCustomPropertiesParser";
import TiledMapLayer from "./TiledMapLayer";
import TiledMapLayerGridCSVParser from "./TiledMapLayerGridCSVParser";
import { default as TiledMapLayerException } from "./Exception/Tiled/Map/Layer";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";
import type { TiledMapLayerParser as TiledMapLayerParserInterface } from "../interfaces/TiledMapLayerParser";

export default class TiledMapLayerParser implements TiledMapLayerParserInterface {
  +layerElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +mapSize: ElementSizeInterface<"tile">;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, layerElement: HTMLElement, mapSize: ElementSizeInterface<"tile">) {
    this.layerElement = layerElement;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.mapSize = mapSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapLayerInterface> {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(breadcrumbs, "Cancel token was cancelled before parsing tiled layer.");
    }

    const layerName = xml.getStringAttribute(breadcrumbs, this.layerElement, "name");
    const breadcrumbsLayerName = breadcrumbs.addVariable(layerName);
    const dataElement = this.layerElement.getElementsByTagName("data").item(0);

    if (!dataElement) {
      throw new TiledMapLayerException(breadcrumbsLayerName, "No data found in map layer.");
    }

    const dataEncoding = xml.getStringAttribute(breadcrumbsLayerName, dataElement, "encoding");

    if ("csv" !== dataEncoding) {
      throw new TiledMapLayerException(
        breadcrumbsLayerName,
        `Data encoding format is not supported yet: "${dataEncoding}"`
      );
    }

    const tiledMapLayerCSVDataParser = new TiledMapLayerGridCSVParser(
      breadcrumbsLayerName,
      dataElement.textContent,
      this.mapSize
    );
    const tiledMapGrid = await tiledMapLayerCSVDataParser.parse(cancelToken);
    const layerSize = new ElementSize<"tile">(
      xml.getNumberAttribute(breadcrumbsLayerName, this.layerElement, "width"),
      xml.getNumberAttribute(breadcrumbsLayerName, this.layerElement, "height")
    );

    const tiledCustomPropertiesElement = this.layerElement.getElementsByTagName("properties").item(0);

    if (!tiledCustomPropertiesElement) {
      return new TiledMapLayer(layerName, tiledMapGrid, layerSize, new TiledCustomProperties(breadcrumbsLayerName));
    }

    const tiledCustomPropertiesParser = new TiledCustomPropertiesParser(
      breadcrumbsLayerName,
      tiledCustomPropertiesElement
    );
    const tiledCustomProperties = await tiledCustomPropertiesParser.parse(cancelToken);

    return new TiledMapLayer(layerName, tiledMapGrid, layerSize, tiledCustomProperties);
  }
}
