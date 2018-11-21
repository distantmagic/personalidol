// @flow

import DialogueMessage from "./DialogueMessage";
import Expression from "../classes/Expression";

export default class DialogueMessageParser {
  message: Object;

  constructor(message: Object) {
    this.message = message;
  }

  async parse(): Promise<DialogueMessage> {
    const expression = new Expression(this.message.label);
    const label = await expression.execute({
      character: {
        player() {
          return {
            name: "foo"
          };
        }
      },
      this: {
        actor: {
          name: "bar"
        }
      }
    });

    return new DialogueMessage({
      label: label
    });
  }
}
