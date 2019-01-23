// @flow

import type { DialogueFragment } from "./DialogueFragment";
import type { DialogueMessage } from "./DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";

export interface DialogueTurn extends DialogueFragment {
  actor(): Promise<string>;

  answer(DialogueMessage): Promise<?DialogueTurn>;

  answers(): Promise<DialogueMessages>;

  followUpAnswer(DialogueMessage): Promise<?DialogueMessage>;

  prompt(): Promise<string>;
}
