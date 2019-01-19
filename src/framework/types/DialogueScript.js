// @flow

import type { DialogueScriptMessage } from "./DialogueScriptMessage";

export type DialogueScript = {
  messages: {
    [string]: DialogueScriptMessage
  },
  metadata: {
    start_message: string
  }
};
