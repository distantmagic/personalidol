// @flow

import { default as CharacterModel } from "../Entity/Person/Character";
import { default as CharacterResourceReference } from "../ResourceReference/Character";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Character implements Query<CharacterModel> {
  +ref: CharacterResourceReference;

  constructor(ref: CharacterResourceReference) {
    this.ref = ref;
  }

  async execute(cancelToken?: CancelToken): Promise<?CharacterModel> {
    const ref = this.ref.getReference();

    switch (ref) {
      case "arlance":
      case "circassia":
      case "moore":
        return new CharacterModel(ref);
      default:
        return null;
    }
  }

  isEqual(other: Character): boolean {
    return this.ref.isEqual(other.ref);
  }
}
