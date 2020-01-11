import Exception from "./Exception";
import isArrayEqual from "../helpers/isArrayEqual";

import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QuakeEntityProperty } from "../interfaces/QuakeEntityProperty";
import { QuakeEntityProperties as QuakeEntityPropertiesInterface } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntityProperties implements QuakeEntityPropertiesInterface {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly propsMap: Map<string, QuakeEntityProperty>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: ReadonlyArray<QuakeEntityProperty>) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.propsMap = new Map<string, QuakeEntityProperty>();

    for (let prop of props) {
      const key = prop.getKey();

      if (this.propsMap.has(key)) {
        throw new Exception(loggerBreadcrumbs.add("constructor"), "Duplicate quake entity prop.");
      }

      this.propsMap.set(key, prop);
    }
  }

  getProperties(): ReadonlyArray<QuakeEntityProperty> {
    return Array.from(this.propsMap.values());
  }

  getPropertyByKey(key: string): QuakeEntityProperty {
    const prop = this.propsMap.get(key);

    if (!this.hasPropertyKey(key) || !prop) {
      throw new Exception(this.loggerBreadcrumbs.add("getPropertyByKey"), `Property does not exist: "${key}"`);
    }

    return prop;
  }

  hasPropertyKey(key: string): boolean {
    return this.propsMap.has(key);
  }

  isEqual(other: QuakeEntityPropertiesInterface): boolean {
    const thisProps = this.getProperties();
    const otherProps = other.getProperties();

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), thisProps, otherProps);
  }
}
