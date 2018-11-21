// @flow

import YAML from "yaml";

import Dialogue from "./Dialogue";
import DialogueMessage from "./DialogueMessage";
import DialogueMessageParser from "./DialogueMessageParser";

export default class DialogueParser {
  dialogue: string;

  constructor(dialogue: string) {
    this.dialogue = dialogue;
  }

  async parse(): Promise<Dialogue> {
    const parsed = YAML.parse(this.dialogue);
    const messages = await Promise.all(this.prepareMessages(parsed));

    return new Dialogue(messages);
  }

  prepareMessages(dialogue: Object): Array<Promise<DialogueMessage>> {
    return dialogue.dialogue.start.map(message =>
      new DialogueMessageParser(message).parse()
    );
  }
}
