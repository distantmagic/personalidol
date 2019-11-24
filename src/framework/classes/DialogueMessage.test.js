// @flow

import DialogueMessage from "./DialogueMessage";
import ExpressionBus from "./ExpressionBus";
import ExpressionContext from "./ExpressionContext";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("determines if message is an answer to something else", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs);
  const expressionBus = new ExpressionBus();

  const m1 = new DialogueMessage(expressionBus, context, "foo", {
    actor: "Actor1",
    prompt: "Prompt1",
  });
  const m2 = new DialogueMessage(expressionBus, context, "bar", {
    actor: "Actor2",
    answer_to: "foo",
    prompt: "Prompt2",
  });
  const m3 = new DialogueMessage(expressionBus, context, "baz", {
    actor: "Actor2",
    prompt: "Prompt2",
  });

  expect(await m2.isAnswerTo(m1)).toBeTruthy();
  expect(await m3.isAnswerTo(m1)).toBeFalsy();
});
