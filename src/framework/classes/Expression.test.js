// @flow

import Expression from "./Expression";
import ExpressionContext from "./ExpressionContext";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("performs math calculations", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs);
  const expression = new Expression("{{ 2 + 2 }}", context);
  const result = expression.execute();

  await expect(result).resolves.toBe("4");
});

test("uses variables", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs, {
    foo: 3,
  });
  const expression = new Expression("{{ 2 + foo }}", context);
  const result = expression.execute();

  await expect(result).resolves.toBe("5");
});

test("uses objects", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs, {
    character: {
      player() {
        return {
          name: "CHARNAME",
        };
      },
    },
  });
  const expression = new Expression(`Greetings {{ character.player().name }}`, context);
  const result = expression.execute();

  await expect(result).resolves.toBe("Greetings CHARNAME");
});

test("uses promises", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs, {
    character: {
      player() {
        return {
          name: Promise.resolve("CHARNAME"),
        };
      },
    },
  });
  const expression = new Expression(`Greetings {{ character.player().name }}`, context);
  const result = expression.execute();

  await expect(result).resolves.toBe("Greetings CHARNAME");
});

test("resolves conditions with promises", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs, {
    character: {
      player() {
        return {
          aims() {
            return Promise.resolve(true);
          },
          knows() {
            return Promise.resolve(false);
          },
        };
      },
    },
  });
  const expression = new Expression(`{{ not character.player().knows() and character.player().aims() }}`, context);
  const result = expression.execute();

  await expect(result).resolves.toBe("true");
});
