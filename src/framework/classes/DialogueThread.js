// @flow

import DialogueMessage from "./DialogueMessage";

import type { Stack } from "immutable";

export default class DialogueThread {
  messages: Stack<DialogueMessage>;
}
