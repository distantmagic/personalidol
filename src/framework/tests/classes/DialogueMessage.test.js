// @flow

import DialogueMessage from "../../classes/DialogueMessage";

it("determines if message is an answer to something else", async () => {
  const m1 = new DialogueMessage("foo", {
    actor: "Actor1",
    prompt: "Prompt1"
  });
  const m2 = new DialogueMessage("bar", {
    actor: "Actor2",
    answer_to: "foo",
    prompt: "Prompt2"
  });
  const m3 = new DialogueMessage("baz", {
    actor: "Actor2",
    prompt: "Prompt2"
  });

  expect(await m2.isAnswerTo(m1)).toBeTruthy();
  expect(await m3.isAnswerTo(m1)).toBeFalsy();
});
