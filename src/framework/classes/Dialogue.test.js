// @flow

import fs from "fs-extra";
import path from "path";
import YAML from "yaml";

import Dialogue from "./Dialogue";
import DialogueScript from "./DialogueScript";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";
import Person from "./Entity/Person";

const testContext = {};

beforeEach(async () => {
  const filename = path.join(
    __dirname,
    "__fixtures__/data/dialogues/0001-basic-dialogue.yml"
  );
  const content = await fs.readFile(filename, "utf8");
  const dialogueScript = YAML.parse(content);

  testContext.dialogueScript = dialogueScript;
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
  const prompt = await turn.prompt();

  expect(prompt).toBe("Prompt1");

  // const answers = await turn.answers();
});
