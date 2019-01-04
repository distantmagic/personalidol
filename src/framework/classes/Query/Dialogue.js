// @flow

import { default as DialogueResourceReference } from "../ResourceReference/Dialogue";
import { default as DialogueModel } from "../Dialogue";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Dialogue implements Query<DialogueModel> {
  _ref: DialogueResourceReference;

  constructor(ref: DialogueResourceReference) {
    this._ref = ref;
  }

  async execute(cancelToken?: CancelToken): Promise<DialogueModel> {
    console.log("execute dialogue query");
    return new DialogueModel();
  }

  isEqual(other: Dialogue): boolean {
    return this._ref.isEqual(other._ref);
  }
}
