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

it("starts dialogue turn", async () => {
  const expressionBus = new ExpressionBus();
  const expressionContext = new ExpressionContext();

  const dialogue = new Dialogue(
    expressionBus,
    expressionContext,
    new DialogueScript(testContext.dialogueScript)
  );
  const person = new Person();
  const turn = await dialogue.initiate(person);

  expect(await turn.actor()).toBe("Actor1");
  expect(await turn.prompt()).toBe("Prompt1");

  const answers = await turn.answers();

  expect(answers.has("m1")).toBeTruthy();
  expect(answers.has("m2")).toBeTruthy();
  expect(answers.has("m3")).toBeFalsy();
});
