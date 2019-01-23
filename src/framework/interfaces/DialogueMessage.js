// @flow

import type { DialogueFragment } from "./DialogueFragment";
import type { Expressible } from "./Expressible";

export interface DialogueMessage extends DialogueFragment, Expressible {
  key(): Promise<string>;

  answerTo(): Promise<Array<string>>;

  isAnswerTo(DialogueMessage): Promise<boolean>;
}
