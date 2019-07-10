// @flow

import { default as CharacterModel } from "../Entity/Person/Character";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Character implements Query<CharacterModel> {
  +ref: string;

  constructor(ref: string) {
    this.ref = ref;
  }

  async execute(cancelToken?: CancelToken): Promise<CharacterModel> {
    switch (this.ref) {
      case "arlance":
      case "circassia":
      case "moore":
        return new CharacterModel(this.ref);
      default:
        throw new Error("Error while loading character model.");
    }
  }

  isEqual(other: Character): boolean {
    return this.ref === other.ref;
  }
}
