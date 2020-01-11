// @flow strict

import * as fixtures from "../../fixtures";
import DialogueScript from "./DialogueScript";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

import type { DialogueScript as DialogueScriptType } from "../types/DialogueScript";

function getDialogueScript(): Promise<DialogueScriptType> {
  return fixtures.yamlFile("dialogue-basic.yml");
}

test("loads dialogue messages", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const dialogueScript = new DialogueScript(new ExpressionBus(), new ExpressionContext(loggerBreadcrumbs), await getDialogueScript());
  const messages = await dialogueScript.getMessages();
});
