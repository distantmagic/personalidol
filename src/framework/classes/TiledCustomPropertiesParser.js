// @flow

import * as xml from "../helpers/xml";
import assert from "../helpers/assert";
import Cancelled from "./Exception/Cancelled";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomPropertiesException from "./Exception/Tiled/CustomProperties";
import TiledCustomPropertyParser from "./TiledCustomPropertyParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties as TiledCustomPropertiesInterface } from "../interfaces/TiledCustomProperties";
import type { TiledCustomPropertiesParser as TiledCustomPropertiesParserInterface } from "../interfaces/TiledCustomPropertiesParser";

export default class TiledCustomPropertiesParser implements TiledCustomPropertiesParserInterface {
  +propertiesElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, propertiesElement: HTMLElement) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.propertiesElement = propertiesElement;
  }

  async parse(cancelToken: CancelToken): Promise<TiledCustomPropertiesInterface> {
    const currentLoggerBreadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(currentLoggerBreadcrumbs, "Cancel token was cancelled before parsing custom properties.");
    }

    if ("properties" !== this.propertiesElement.localName) {
      throw new TiledCustomPropertiesException(
        currentLoggerBreadcrumbs,
        "Properties element must be named 'properties'."
      );
    }

    const propertiesElements = this.propertiesElement.getElementsByTagName("property");
    const tiledCustomProperties = new TiledCustomProperties(currentLoggerBreadcrumbs);

    for (let i = 0; i < propertiesElements.length; i += 1) {
      const propertyElement = assert<HTMLElement>(currentLoggerBreadcrumbs, propertiesElements.item(i));
      const tiledCustomPropertyParser = new TiledCustomPropertyParser(currentLoggerBreadcrumbs, propertyElement);
      const tiledCustomProperty = await tiledCustomPropertyParser.parse(cancelToken);

      tiledCustomProperties.addProperty(tiledCustomProperty);
    }

    return tiledCustomProperties;
  }
}
