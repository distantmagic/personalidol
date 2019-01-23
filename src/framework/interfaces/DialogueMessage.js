// @flow

import type { DialogueFragment } from "./DialogueFragment";

export interface DialogueMessage extends DialogueFragment {
  key(): Promise<string>;

  answerTo(): Promise<Array<string>>;

  isAnswerTo(DialogueMessage): Promise<boolean>;
}
