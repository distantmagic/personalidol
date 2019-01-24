// @flow

import type { DialogueFragment } from "./DialogueFragment";
import type { Expressible } from "./Expressible";
import type { Expression } from "./Expression";

export interface DialogueMessage extends DialogueFragment, Expressible {
  condition(): ?Expression;

  key(): Promise<string>;

  answerTo(): Promise<Array<string>>;

  isAnswerTo(DialogueMessage): Promise<boolean>;
}
