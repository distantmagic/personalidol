// @flow

import TiledCustomProperties from "./TiledCustomProperties";
import TiledCustomPropertyUnserializer from "./TiledCustomPropertyUnserializer";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties as TiledCustomPropertiesInterface } from "../interfaces/TiledCustomProperties";
import type { TiledCustomPropertiesSerializedObject } from "../types/TiledCustomPropertiesSerializedObject";
import type { TiledCustomPropertiesUnserializer as TiledCustomPropertiesUnserializerInterface } from "../interfaces/TiledCustomPropertiesUnserializer";
import type { TiledCustomPropertyUnserializer as TiledCustomPropertyUnserializerInterface } from "../interfaces/TiledCustomPropertyUnserializer";

export default class TiledCustomPropertiesUnserializer implements TiledCustomPropertiesUnserializerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledCustomPropertyUnserializer: TiledCustomPropertyUnserializerInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledCustomPropertyUnserializer = new TiledCustomPropertyUnserializer(loggerBreadcrumbs);
  }

  fromJson(serialized: string): TiledCustomPropertiesInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledCustomPropertiesSerializedObject): TiledCustomPropertiesInterface {
    const tiledCustomProperties = new TiledCustomProperties(this.loggerBreadcrumbs);

    for (let tiledCustomPropertySerializedObject of parsed.tiledCustomProperties) {
      const tiledCustomProperty = this.tiledCustomPropertyUnserializer.fromObject(tiledCustomPropertySerializedObject);

      tiledCustomProperties.addProperty(tiledCustomProperty);
    }

    return tiledCustomProperties;
  }
}
