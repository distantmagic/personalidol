// @flow

import type { Contextual } from "./Contextual";
import type { DialogueFragment } from "./DialogueFragment";
import type { DialogueMessage } from "./DialogueMessage";
import type { DialogueMessages } from "../types/DialogueMessages";
import type { Identifiable } from "./Identifiable";
import type { Speaks } from "./Sentient/Speaks";

export interface DialogueTurn extends Contextual, DialogueFragment {
  actor(): Promise<string>;

  answer(DialogueMessage): Promise<?DialogueTurn>;

  answers(): Promise<DialogueMessages>;

  followUpAnswer(DialogueMessage): Promise<?DialogueMessage>;

  getCurrentMessage(): Promise<DialogueMessage>;

  initiator(): Promise<Identifiable & Speaks>;

  prompt(): Promise<string>;
}
