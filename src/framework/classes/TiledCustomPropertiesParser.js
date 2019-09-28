// @flow

import assert from "../helpers/assert";
import Cancelled from "./Exception/Cancelled";
import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomPropertiesException from "./Exception/Tiled/CustomProperties";
import TiledCustomPropertyParser from "./TiledCustomPropertyParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties as TiledCustomPropertiesInterface } from "../interfaces/TiledCustomProperties";
import type { TiledCustomPropertiesParser as TiledCustomPropertiesParserInterface } from "../interfaces/TiledCustomPropertiesParser";

export default class TiledCustomPropertiesParser implements TiledCustomPropertiesParserInterface {
  +element: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, element: HTMLElement) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.element = element;
  }

  async parse(cancelToken: CancelToken): Promise<TiledCustomPropertiesInterface> {
    const currentLoggerBreadcrumbs = this.loggerBreadcrumbs.add("parse");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(currentLoggerBreadcrumbs, "Cancel token was cancelled before parsing custom properties.");
    }

    const propertiesElements = this.element.getElementsByTagName("properties");

    if (0 === propertiesElements.length) {
      // empty properties list for consitency
      return new TiledCustomProperties(currentLoggerBreadcrumbs);
    }

    if (1 !== propertiesElements.length) {
      throw new TiledCustomPropertiesException(
        currentLoggerBreadcrumbs,
        "Object may contain only 1 properties set."
      );
    }

    const propertiesElement = assert<HTMLElement>(currentLoggerBreadcrumbs, propertiesElements.item(0));
    const elements = propertiesElement.getElementsByTagName("property");
    const tiledCustomProperties = new TiledCustomProperties(currentLoggerBreadcrumbs);

    for (let i = 0; i < elements.length; i += 1) {
      const propertyElement = assert<HTMLElement>(currentLoggerBreadcrumbs, elements.item(i));
      const tiledCustomPropertyParser = new TiledCustomPropertyParser(currentLoggerBreadcrumbs, propertyElement);
      const tiledCustomProperty = await tiledCustomPropertyParser.parse(cancelToken);

      tiledCustomProperties.addProperty(tiledCustomProperty);
    }

    return tiledCustomProperties;
  }
}
