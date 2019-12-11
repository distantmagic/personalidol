// @flow

import { default as QuakeMapException } from "./Exception/QuakeMap";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeEntityProperty as QuakeEntityPropertyInterface } from "../interfaces/QuakeEntityProperty";

export default class QuakeEntityProperty implements QuakeEntityPropertyInterface {
  +key: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +value: string;

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

  isEqual(other: QuakeEntityPropertyInterface): boolean {
    return this.getKey() === other.getKey() && this.getValue() === other.getValue();
  }
}
