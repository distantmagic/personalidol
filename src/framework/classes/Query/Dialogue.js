// @flow

import YAML from "yaml";

import { default as DialogueResourceReference } from "../ResourceReference/Dialogue";
import { default as DialogueModel } from "../Dialogue";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Dialogue implements Query<DialogueModel> {
  ref: DialogueResourceReference;

  constructor(ref: DialogueResourceReference) {
    this.ref = ref;
  }

  async execute(cancelToken?: CancelToken): Promise<DialogueModel> {
    const response = await fetch(this.ref.getReference());
    const dialogue = await response.text();

    return new DialogueModel(YAML.parse(dialogue));
  }

  isEqual(other: Dialogue): boolean {
    return this.ref.isEqual(other.ref);
  }
}
