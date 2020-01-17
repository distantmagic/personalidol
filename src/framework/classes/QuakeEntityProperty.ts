import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IQuakeEntityProperty } from "src/framework/interfaces/QuakeEntityProperty";

export default class QuakeEntityProperty implements IQuakeEntityProperty {
  readonly key: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly value: string;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, key: string, value: string) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.key = key;
    this.value = value;
  }

  getKey(): string {
    return this.key;
  }

  getValue(): string {
    return this.value;
  }

  asNumber(): number {
    const value = Number(this.getValue());

    if (isNaN(value)) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("asNumber"), `Property is not a number: "${this.getKey()}"`);
    }

    return value;
  }

  isEqual(other: IQuakeEntityProperty): boolean {
    return this.getKey() === other.getKey() && this.getValue() === other.getValue();
  }
}
