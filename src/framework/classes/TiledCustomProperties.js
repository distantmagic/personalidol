// @flow

import assert from "../helpers/assert";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties as TiledCustomPropertiesInterface } from "../interfaces/TiledCustomProperties";
import type { TiledCustomProperty } from "../interfaces/TiledCustomProperty";

export default class TiledCustomProperties implements TiledCustomPropertiesInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledCustomProperties: Map<string, TiledCustomProperty>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledCustomProperties = new Map<string, TiledCustomProperty>();
  }

  addProperty(tiledCustomProperty: TiledCustomProperty): void {
    this.tiledCustomProperties.set(tiledCustomProperty.getName(), tiledCustomProperty);
  }

  getPropertyByName(name: string): TiledCustomProperty {
    const tiledCustomProperty = this.tiledCustomProperties.get(name);

    return assert<TiledCustomProperty>(this.loggerBreadcrumbs, tiledCustomProperty);
  }

  hasProperty(tiledCustomProperty: TiledCustomProperty): boolean {
    const name = tiledCustomProperty.getName();

    if (!this.hasPropertyByName(name)) {
      return false;
    }

    const thisProperty = this.getPropertyByName(name);

    return thisProperty.isEqual(tiledCustomProperty);
  }

  hasPropertyByName(name: string): boolean {
    return this.tiledCustomProperties.has(name);
  }

  isEqual(other: TiledCustomPropertiesInterface): boolean {
    const thisKeys = this.keys();
    const otherKeys = other.keys();

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    for (let otherKey of otherKeys) {
      if (!this.hasPropertyByName(otherKey)) {
        return false;
      }

      const thisProperty = this.getPropertyByName(otherKey);
      const otherProperty = other.getPropertyByName(otherKey);

      if (!thisProperty.isEqual(otherProperty)) {
        return false;
      }
    }

    return true;
  }

  keys(): $ReadOnlyArray<string> {
    return Array.from(this.tiledCustomProperties.keys());
  }
}
