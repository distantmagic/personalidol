// @flow

import { default as CharacterModel } from "../Entity/Person/Character";

import type { ResourceReference } from "../../interfaces/ResourceReference";

export default class Character
  implements ResourceReference<string, CharacterModel> {
  _key: string;

  constructor(key: string) {
    this._key = key;
  }

  getReference(): string {
    return this._key;
  }

  isEqual(other: Character) {
    return other._key === this._key;
  }
}
