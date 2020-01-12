import { default as CharacterModel } from "src/framework/classes/Entity/Person/Character";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { Query } from "src/framework/interfaces/Query";

export default class Character implements Query<CharacterModel> {
  readonly ref: string;

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
