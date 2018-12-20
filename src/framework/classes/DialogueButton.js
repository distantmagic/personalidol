// @flow

import type { Expressible } from "../interfaces/Expressible";
import type { Expression } from "../interfaces/Expression";

export default class DialogueButton implements Expressible<any> {
  expression(): ?Expression<any> {
    return null;
  }
}
