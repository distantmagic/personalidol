// @flow

import * as fixtures from "../fixtures";
import DialogueScript from "../../classes/DialogueScript";
import ExpressionContext from "../../classes/ExpressionContext";

const testContext = {};

beforeEach(async () => {
  testContext.dialogueScript = await fixtures.dialogue(
    "0001-basic-dialogue.yml"
  );
});

it("loads dialogue messages", async () => {
  const context = new ExpressionContext();
  const dialogueScript = new DialogueScript(
    context,
    testContext.dialogueScript
  );
  const messages = await dialogueScript.getMessages();
});
