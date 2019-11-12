// @flow

import type { QuakeEntityProperty as QuakeEntityPropertyInterface } from "../interfaces/QuakeEntityProperty";

export default class QuakeEntityProperty implements QuakeEntityPropertyInterface {
  +key: string;
  +value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  getKey(): string {
    return this.key;
  }

  getValue(): string {
    return this.value;
  }

  isEqual(other: QuakeEntityPropertyInterface): boolean {
    return this.getKey() === other.getKey() && this.getValue() === other.getValue();
  }
}
