// @flow strict

import type { DialogueFragment } from "./DialogueFragment";
import type { DialogueScriptMessage } from "../types/DialogueScriptMessage";
import type { Expression } from "./Expression";

export interface DialogueMessage extends DialogueFragment {
  condition(): ?Expression;

  key(): string;

  answerTo(): Promise<$ReadOnlyArray<string>>;

  getMessageScript(): DialogueScriptMessage;

  isAnswerTo(DialogueMessage): Promise<boolean>;
}
