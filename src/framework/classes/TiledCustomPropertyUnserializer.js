// @flow

import TiledCustomProperty from "./TiledCustomProperty";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperty as TiledCustomPropertyInterface } from "../interfaces/TiledCustomProperty";
import type { TiledCustomPropertyUnserializer as TiledCustomPropertyUnserializerInterface } from "../interfaces/TiledCustomPropertyUnserializer";
import type { TiledCustomPropertySerializedObject } from "../types/TiledCustomPropertySerializedObject";

export default class TiledCustomPropertyUnserializer implements TiledCustomPropertyUnserializerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  fromJson(serialized: string): TiledCustomPropertyInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledCustomPropertySerializedObject): TiledCustomPropertyInterface {
    return new TiledCustomProperty(this.loggerBreadcrumbs, parsed.name, parsed.type, parsed.value);
  }
}
