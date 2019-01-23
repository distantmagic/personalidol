// @flow

import * as fixtures from "../fixtures";
import DialogueScript from "../../classes/DialogueScript";

const testContext = {};

beforeEach(async () => {
  testContext.dialogueScript = await fixtures.dialogue(
    "0001-basic-dialogue.yml"
  );
});

it("loads dialogue messages", async () => {
  const dialogueScript = new DialogueScript(testContext.dialogueScript);
  const messages = await dialogueScript.getMessages();
});
