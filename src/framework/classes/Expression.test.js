// @flow

import Expression from "./Expression";

declare var expect: any;
declare var it: any;

it("performs math calculations", () => {
  const expression = new Expression("{{ 2 + 2 }}");
  const result = expression.execute();

  expect(result).resolves.toBe("4");
});

it("uses variables", () => {
  const expression = new Expression("{{ 2 + foo }}");
  const result = expression.execute({
    foo: 3
  });

  expect(result).resolves.toBe("5");
});

it("uses objects", () => {
  const expression = new Expression(`Greetings {{ character.player().name }}`);
  const result = expression.execute({
    character: {
      player: () => ({ name: "CHARNAME" })
    }
  });

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("uses promises", () => {
  const expression = new Expression(`Greetings {{ character.player().name }}`);
  const result = expression.execute({
    character: {
      player: () => ({
        name: Promise.resolve("CHARNAME")
      })
    }
  });

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("resolves conditions with promises", () => {
  const expression = new Expression(`
    {{ not character.player().knows() and character.player().aims() }}
  `);
  const result = expression.execute({
    character: {
      player: () => ({
        aims: () => Promise.resolve(true),
        knows: () => Promise.resolve(false)
      })
    }
  });

  expect(result).resolves.toBe("true");
});
