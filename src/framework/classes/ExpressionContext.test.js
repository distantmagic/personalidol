// @flow

import Expression from "./Expression";
import ExpressionContext from "./ExpressionContext";
import UnexpectedOverride from "./Exception/UnexpectedOverride";

it("is immutable", () => {
  const context = new ExpressionContext();
  const updated = context.set("foo", "bar");

  expect(context).not.toBe(updated);
  expect(context.has("foo")).toBeFalsy();
});

it("cannot override values", () => {
  const context = new ExpressionContext();

  expect(() => {
    context.set("foo", "bar").set("foo", "baz");
  }).toThrow(UnexpectedOverride);
});
