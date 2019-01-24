// @flow

import type { DialogueFragment } from "./DialogueFragment";
import type { Expression } from "./Expression";

export interface DialogueMessage extends DialogueFragment {
  condition(): ?Expression;

  key(): Promise<string>;

  answerTo(): Promise<Array<string>>;

  isAnswerTo(DialogueMessage): Promise<boolean>;
}
