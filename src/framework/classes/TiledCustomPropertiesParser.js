// @flow

import * as xml from "../helpers/xml";
import TiledCustomProperties from "./TiledCustomProperties";
import { default as TiledCustomPropertiesException } from "./Exception/Tiled/CustomProperties";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties as TiledCustomPropertiesInterface } from "../interfaces/TiledCustomProperties";
import type { TiledCustomPropertiesParser as TiledCustomPropertiesParserInterface } from "../interfaces/TiledCustomPropertiesParser";

export default class TiledCustomPropertiesParser
  implements TiledCustomPropertiesParserInterface {
  +propertiesElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    propertiesElement: HTMLElement
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.propertiesElement = propertiesElement;
  }

  async parse(
    cancelToken: CancelToken
  ): Promise<TiledCustomPropertiesInterface> {}
}
