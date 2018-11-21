// @flow

import DialogueContext from "./DialogueContext";
import DialogueMessage from "./DialogueMessage";
import Expression from "../classes/Expression";

export default class DialogueMessageParser {
  message: Object;

  constructor(message: Object) {
    this.message = message;
  }

  async parse(context: DialogueContext): Promise<DialogueMessage> {
    const expression = new Expression(this.message.label);
    const data = await context.data();
    const label = await expression.execute(data);

    return new DialogueMessage({
      label: label
    });
  }
}
