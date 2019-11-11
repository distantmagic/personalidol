// @flow

import type { QuakeBrushEntityProperty as QuakeBrushEntityPropertyInterface } from "../interfaces/QuakeBrushEntityProperty";

export default class QuakeBrushEntityProperty implements QuakeBrushEntityPropertyInterface {
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

  isEqual(other: QuakeBrushEntityPropertyInterface): boolean {
    return this.getKey() === other.getKey() && this.getValue() === other.getValue();
  }
}
