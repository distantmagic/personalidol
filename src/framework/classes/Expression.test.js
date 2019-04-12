// @flow

import Expression from "./Expression";
import ExpressionContext from "./ExpressionContext";

it("performs math calculations", function() {
  const context = new ExpressionContext();
  const expression = new Expression("{{ 2 + 2 }}", context);
  const result = expression.execute();

  expect(result).resolves.toBe("4");
});

it("uses variables", function() {
  const context = new ExpressionContext({
    foo: 3
  });
  const expression = new Expression("{{ 2 + foo }}", context);
  const result = expression.execute();

  expect(result).resolves.toBe("5");
});

it("uses objects", function() {
  const context = new ExpressionContext({
    character: {
      player() {
        return {
          name: "CHARNAME"
        };
      }
    }
  });
  const expression = new Expression(
    `Greetings {{ character.player().name }}`,
    context
  );
  const result = expression.execute();

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("uses promises", function() {
  const context = new ExpressionContext({
    character: {
      player() {
        return {
          name: Promise.resolve("CHARNAME")
        };
      }
    }
  });
  const expression = new Expression(
    `Greetings {{ character.player().name }}`,
    context
  );
  const result = expression.execute();

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("resolves conditions with promises", function() {
  const context = new ExpressionContext({
    character: {
      player() {
        return {
          aims() {
            return Promise.resolve(true);
          },
          knows() {
            return Promise.resolve(false);
          }
        };
      }
    }
  });
  const expression = new Expression(
    `{{ not character.player().knows() and character.player().aims() }}`,
    context
  );
  const result = expression.execute();

  expect(result).resolves.toBe("true");
});
