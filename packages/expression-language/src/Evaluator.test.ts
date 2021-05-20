import { Evaluator } from "./Evaluator";

test("evaluates expressions without context", function () {
  const evaluator = Evaluator();

  const ret = evaluator.evaluate("2 + 3");

  return expect(ret).resolves.toBe(5);
});

test("evaluates expressions with context", function () {
  const evaluator = Evaluator({
    foo: 7,
  });

  const ret = evaluator.evaluate("2 + foo");

  return expect(ret).resolves.toBe(9);
});
