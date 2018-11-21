// @flow

import YAML from "yaml";

import Dialogue from "./Dialogue";
import DialogueContext from "./DialogueContext";
import DialogueMessage from "./DialogueMessage";
import DialogueMessageParser from "./DialogueMessageParser";

export default class DialogueParser {
  dialogue: string;

  constructor(dialogue: string) {
    this.dialogue = dialogue;
  }

  async parse(context: DialogueContext): Promise<Dialogue> {
    const parsed = YAML.parse(this.dialogue);
    const messages = await Promise.all(this.prepareMessages(context, parsed));

    return new Dialogue(messages);
  }

  prepareMessages(
    context: DialogueContext,
    dialogue: Object
  ): Array<Promise<DialogueMessage>> {
    return dialogue.dialogue.start.map(message =>
      new DialogueMessageParser(message).parse(context)
    );
  }
}
