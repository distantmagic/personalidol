// @flow

import type { Equatable } from "../interfaces/Equatable";
import type { Expressible } from "../interfaces/Expressible";
import type { Expression } from "../interfaces/Expression";

export default class DialogueButton
  implements Equatable<DialogueButton>, Expressible<any> {
  _label: string;

  constructor(label: string) {
    this._label = label;
  }

  isEqual(other: DialogueButton): boolean {
    return this.label() === other.label();
  }

  label(): string {
    return this._label;
  }

  expression(): ?Expression<any> {
    return null;
  }
}
