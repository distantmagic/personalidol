// @flow

import { default as DialogueModel } from "../Dialogue";

import type { ResourceReference } from "../../interfaces/ResourceReference";

export default class Dialogue
  implements ResourceReference<string, DialogueModel> {
  _key: string;

  constructor(key: string) {
    this._key = key;
  }

  getReference(): string {
    return this._key;
  }

  isEqual(other: Dialogue) {
    return other._key === this._key;
  }
}
