// @flow

import * as fixtures from "../fixtures";
import DialogueScript from "./DialogueScript";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";

const testContext = {};

beforeEach(async () => {
  testContext.dialogueScript = await fixtures.dialogue(
    "0001-basic-dialogue.yml"
  );
});

it("loads dialogue messages", async () => {
  const dialogueScript = new DialogueScript(
    new ExpressionBus(),
    new ExpressionContext(),
    testContext.dialogueScript
  );
  const messages = await dialogueScript.getMessages();
});
