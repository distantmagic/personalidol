// @flow

import Expression from "./Expression";
import ExpressionContext from "./ExpressionContext";

declare var expect: any;
declare var it: any;

it("performs math calculations", () => {
  const expression = new Expression("{{ 2 + 2 }}");
  const result = expression.execute();

  expect(result).resolves.toBe("4");
});

it("uses variables", () => {
  const context = new ExpressionContext({
    foo: 3
  });
  const expression = new Expression("{{ 2 + foo }}", context);
  const result = expression.execute();

  expect(result).resolves.toBe("5");
});

it("uses objects", () => {
  const context = new ExpressionContext({
    character: {
      player: () => ({ name: "CHARNAME" })
    }
  });
  const expression = new Expression(`Greetings {{ character.player().name }}`, context);
  const result = expression.execute();

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("uses promises", () => {
  const context = new ExpressionContext({
    character: {
      player: () => ({
        name: Promise.resolve("CHARNAME")
      })
    }
  });
  const expression = new Expression(`Greetings {{ character.player().name }}`, context);
  const result = expression.execute();

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("resolves conditions with promises", () => {
  const context = new ExpressionContext({
    character: {
      player: () => ({
        aims: () => Promise.resolve(true),
        knows: () => Promise.resolve(false)
      })
    }
  });
  const expression = new Expression(
    `{{ not character.player().knows() and character.player().aims() }}`,
    context
  );
  const result = expression.execute();

  expect(result).resolves.toBe("true");
});
