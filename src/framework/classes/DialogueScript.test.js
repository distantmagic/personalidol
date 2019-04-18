// @flow

import * as fixtures from "../../fixtures";
import DialogueScript from "./DialogueScript";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";

const testContext = {};

beforeEach(async function() {
  testContext.dialogueScript = await fixtures.dialogue("dialogue-basic.yml");
});

it("loads dialogue messages", async function() {
  const dialogueScript = new DialogueScript(
    new ExpressionBus(),
    new ExpressionContext(),
    testContext.dialogueScript
  );
  const messages = await dialogueScript.getMessages();
});
