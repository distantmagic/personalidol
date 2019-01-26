// @flow

import * as fixtures from "../fixtures";
import Dialogue from "../../classes/Dialogue";
import DialogueScript from "../../classes/DialogueScript";
import ExpressionBus from "../../classes/ExpressionBus";
import ExpressionContext from "../../classes/ExpressionContext";
import Person from "../../classes/Entity/Person";

const testContext = {};

beforeEach(async () => {
  testContext.dialogueScript = await fixtures.dialogue(
    "0001-basic-dialogue.yml"
  );
});

it("switches dialogue turns", async () => {
  const expressionBus = new ExpressionBus();
  const expressionContext = new ExpressionContext();

  const dialogue = new Dialogue(
    expressionBus,
    expressionContext,
    new DialogueScript(
      expressionBus,
      expressionContext,
      testContext.dialogueScript
    )
  );
  const person = new Person("TestActor");
  const turn1 = await dialogue.initiate(person);

  expect(await turn1.actor()).toBe("Actor1 (start)");
  expect(await turn1.prompt()).toBe("Prompt1 (Actor1 (start))");

  const answers = await turn1.answers();

  expect(answers.has("m1")).toBeTruthy();
  expect(answers.has("m2")).toBeTruthy();
  expect(answers.has("m3")).toBeFalsy();
  expect(answers.has("m4")).toBeFalsy();
  expect(answers.has("m5")).toBeTruthy();

  const answer1 = answers.get("m1");

  if (!answer1) {
    throw new Error("Answer1 is unexpectedly empty.");
  }

  const turn2 = await turn1.answer(answer1);

  if (!turn2) {
    throw new Error("Turn2 is unexpectedly empty.");
  }

  expect(await turn2.actor()).toBe("Actor6");
  expect(await turn2.prompt()).toBe("Prompt6");
});
