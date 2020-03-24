import isArrayEqual from "src/framework/helpers/isArrayEqual";

import Exception from "src/framework/classes/Exception";

import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type QuakeEntityProperty from "src/framework/interfaces/QuakeEntityProperty";
import type { default as IQuakeEntityProperties } from "src/framework/interfaces/QuakeEntityProperties";

export default class QuakeEntityProperties implements HasLoggerBreadcrumbs, IQuakeEntityProperties {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly propsMap: Map<string, QuakeEntityProperty> = new Map<string, QuakeEntityProperty>();

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: ReadonlyArray<QuakeEntityProperty>) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;

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

  isEqual(other: IQuakeEntityProperties): boolean {
    const thisProps = this.getProperties();
    const otherProps = other.getProperties();

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), thisProps, otherProps);
  }
}
