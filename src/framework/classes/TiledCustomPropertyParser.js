// @flow

import * as xml from "../helpers/xml";
import TiledCustomProperty from "./TiledCustomProperty";
import TiledCustomPropertiesException from "./Exception/Tiled/CustomProperties";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperty as TiledCustomPropertyInterface } from "../interfaces/TiledCustomProperty";
import type { TiledCustomPropertyParser as TiledCustomPropertyParserInterface } from "../interfaces/TiledCustomPropertyParser";

export default class TiledCustomPropertyParser
  implements TiledCustomPropertyParserInterface {
  +propertyElement: HTMLElement;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    propertyElement: HTMLElement
  ) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.propertyElement = propertyElement;
  }

  async parse(cancelToken: CancelToken): Promise<TiledCustomPropertyInterface> {
    const typeAttribute = this.propertyElement.attributes.getNamedItem("type");

    // string by default
    const type = typeAttribute ? typeAttribute.value : "string";

    switch (type) {
      case "bool":
      case "color":
      case "float":
      case "file":
      case "int":
      case "string":
        break;
      default:
        throw new TiledCustomPropertiesException(
          this.loggerBreadcrumbs,
          `Unsupported custom property type: "${type}"`
        );
    }

    const name = xml.getAttribute(
      this.loggerBreadcrumbs,
      this.propertyElement,
      "name"
    ).value;
    const value = xml.getAttribute(
      this.loggerBreadcrumbs,
      this.propertyElement,
      "value"
    ).value;

    return new TiledCustomProperty(this.loggerBreadcrumbs, name, type, value);
  }
}
