// @flow

import DialogueMessage from "./DialogueMessage";

import type { Stack } from "immutable";

export default class Dialogue {
  messages: Stack<DialogueMessage>;
}
