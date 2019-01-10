// @flow

import type { DialogueScriptMessage } from "./DialogueScriptMessage";

export type DialogueScript = {
  initial_message: string,
  messages: {
    [string]: DialogueScriptMessage
  }
};
