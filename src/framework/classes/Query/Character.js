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

  async execute(cancelToken?: CancelToken): Promise<CharacterModel> {
    // const response = await fetch("https://randomuser.me/api/");
    // const character = await response.json();

    return new CharacterModel(this.ref.getReference());
    // return new CharacterModel(character.results[0].name.first);
  }

  isEqual(other: Character): boolean {
    return this.ref.isEqual(other.ref);
  }
}
