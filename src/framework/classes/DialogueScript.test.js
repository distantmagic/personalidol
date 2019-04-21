// @flow

import * as fixtures from "../../fixtures";
import DialogueScript from "./DialogueScript";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

const testContext = {};

beforeEach(async function() {
  testContext.dialogueScript = await fixtures.dialogue("dialogue-basic.yml");
});

it("loads dialogue messages", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const dialogueScript = new DialogueScript(
    new ExpressionBus(),
    new ExpressionContext(loggerBreadcrumbs),
    testContext.dialogueScript
  );
  const messages = await dialogueScript.getMessages();
});
