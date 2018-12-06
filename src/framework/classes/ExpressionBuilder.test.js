// @flow

import ExpressionBuilder from "./ExpressionBuilder";

declare var expect: any;
declare var it: any;

it("casts to number", async () => {
  const expression = ExpressionBuilder.number("{{ 2 + 2 }}");
  const result: number = await expression.execute();

  expect(result).toBe(4);
});

it("casts to boolean", async () => {
  const expression = ExpressionBuilder.boolean("{{ false }}");
  const result: boolean = await expression.execute();

  expect(result).toBe(false);
});

it("casts to string", async () => {
  const expression = ExpressionBuilder.string("Hi.");
  const result: string = await expression.execute();

  expect(result).toBe("Hi.");
});
