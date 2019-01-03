// @flow

import { default as DialogueModel } from "../Dialogue";

import type { ResourceReference } from "../../interfaces/ResourceReference";

export default class Dialogue implements ResourceReference<DialogueModel> {
  _id: string;

  constructor(id: string) {
    this._id = id;
  }

  isEqual(other: Dialogue) {
    return other._id === this._id;
  }
}
